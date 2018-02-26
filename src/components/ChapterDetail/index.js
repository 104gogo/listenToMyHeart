import React, { PureComponent } from 'react';
import {
  Text,
  View,
  StatusBar,
} from 'react-native';
import Sound from 'react-native-sound';

import { Back, Page } from '../common';
import styles from './styles';

export default class ChapterDetail extends PureComponent {
  constructor() {
    super();

    this.state = { isShowHeader: false };

    this.handleLineLongPress = this.handleLineLongPress.bind(this);
    this.handleShowModal = this.handleShowModal.bind(this);
    this.handleSoundClose = this.handleSoundClose.bind(this);
    this.handleToolBar = this.handleToolBar.bind(this);
    this.handlePageIndexChanged = this.handlePageIndexChanged.bind(this);
  }

  componentDidMount() {
    const { navigation, getChapter } = this.props;

    getChapter(0);
    // getChapter('55eef8b27445ad27755670b9');
  }

  componentWillReceiveProps(nextProps) {
    if ('url' in nextProps && this.props.url !== nextProps.url) {
      const { url, chapters, readIndex, updateState, pn } = nextProps;
      const { lines } = chapters[pn];
console.log('循环播放', lines);
      const sound = new Sound(url, null, (e) => {
        if (e) {
          console.log('播放失败');
          return;
        }

        this.sound = sound;
        updateState({ isRead: true });

        sound.play((success) => {
          if (success) {
            const nextIndex = readIndex + 1;

            // 换行
            if (nextIndex < lines.length) {
              this.props.getMp3Url(lines[nextIndex], nextIndex);
              return;
            }
          }

          this.handleSoundClose();
        });
      });
    }
  }

  componentWillUnmount() {
    this.handleSoundClose();
  }

  handleSoundClose() {
    const { isRead, updateState } = this.props;

    if (isRead) {
      this.sound.release();
      console.log('停止播放');
      updateState({ isRead: false });
    }
  }

  handleLineLongPress(text, index) {
    this.props.getMp3Url(text, index);
  }

  // 控制工具栏的显隐
  handleToolBar() {
    this.setState({ isShowHeader: !this.state.isShowHeader });
  }

  // 显示播放栏
  handleShowModal() {
    // TODO
console.log('handleShowModal');

    this.handleSoundClose();
  }

  // 翻页获取内容
  handlePageIndexChanged(pn) {
    this.props.getChapter(pn);
  }

  render() {
    const { isShowHeader } = this.state;
    const { chapters, isRead, pn, readIndex } = this.props;

    return (
      <View style={styles.container}>
        <StatusBar hidden />
        {isShowHeader ? (
          <View style={styles.header}>
            <Back />
          </View>
        ) : null}
        <View style={styles.title}>
          <Text>{chapters[pn] && chapters[pn].title}</Text>
        </View>
        <Page
          isRead={isRead}
          pn={pn}
          readIndex={readIndex}
          chapters={chapters}
          onLineLongPress={this.handleLineLongPress}
          onLinePress={this.handleToolBar}
          onArticlePress={this.handleShowModal}
          onIndexChanged={this.handlePageIndexChanged}
        />
      </View>
    );
  }
}
