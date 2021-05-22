import React, { Component, MouseEvent, WheelEvent } from 'react';
import { Layer, Line, Rect, Stage, Text } from 'react-konva';
import styled from 'styled-components';
import { Color } from '../styles/color';
import { Transform } from '../utils/transform';

const Layout = styled.div`
  width: 100%;
  height: 100%;
  cursor: grab;

  :active {
    cursor: grabbing;
  }
`;

interface Props {
  data: CandleData[];
}

interface State {
  stageSize: [number, number];
  zoom: number;
  right: number;
  mouseY: number;
}

const candleWidthWeight = 10;
const candleGapWeight = 5;
const headMargin = 36;
const rightMargin = 116;

const squareWidth = 104;
const squareHeight = 24;
const textSize = 12;

export default class Chart extends Component<Props, State> {
  container!: HTMLDivElement;
  mouseDown: boolean = false;
  lastMouseX: number | null = null;

  constructor(props: any) {
    super(props);
    this.state = {
      stageSize: [100, 100],
      zoom: 1,
      right: 500,
      mouseY: 0,
    };
  }

  componentDidMount() {
    this.checkSize();
    window.addEventListener('resize', this.checkSize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.checkSize);
  }

  checkSize = () => {
    const width = this.container.offsetWidth;
    const height = this.container.offsetHeight;
    this.setState({ stageSize: [width, height] });
  };

  onWheelEvent = (e: WheelEvent) => {
    const upWeight = 0.5;
    const downWeight = 0.5;

    const candleWidth = this.state.zoom * candleWidthWeight;
    const candleGap = this.state.zoom * candleGapWeight;

    const currentZoom = this.state.zoom;

    let nextZoom: number;
    if (e.deltaY < 0) {
      nextZoom = Math.min(5, this.state.zoom + upWeight);
    } else {
      nextZoom = Math.max(0.2, this.state.zoom - downWeight);
    }

    const candleCount = this.state.right / (candleWidth + candleGap);

    const rightDelta =
      candleCount * (nextZoom - currentZoom) * (candleWidthWeight + candleGapWeight);

    this.setState({
      zoom: nextZoom,
      right: this.state.right + rightDelta,
    });
  };

  onMouseDown = (e: MouseEvent) => {
    this.mouseDown = true;
    this.lastMouseX = e.clientX;
  };

  onMouseUp = (e: MouseEvent) => {
    this.mouseDown = false;
    this.lastMouseX = null;
  };

  onMouseMove = (e: MouseEvent) => {
    const mouseY = e.clientY - 272;
    this.setState({ mouseY });
    if (!this.mouseDown || this.lastMouseX === null) return false;
    const x = e.clientX;
    const delta = this.lastMouseX - x;
    this.setState({ right: Math.min(500, this.state.right + delta) });
    this.lastMouseX = x;
  };

  render() {
    const stageWidth = this.state.stageSize[0];
    const stageHeight = this.state.stageSize[1];

    const candleWidth = this.state.zoom * candleWidthWeight;
    const candleGap = this.state.zoom * candleGapWeight;

    const data = this.props.data;

    let max: any, min: any, lastAmount: any;
    let preIndex = 0;
    for (const item of data) {
      const right = (preIndex + 1) * candleWidth + preIndex * candleGap + this.state.right;
      const left = stageWidth - right;

      if (left + candleWidth < 0) break;
      if (left + candleWidth > stageWidth - rightMargin) {
        preIndex++;
        continue;
      }

      if (typeof lastAmount === 'undefined') lastAmount = item.to;

      const top = Math.max(item.to, item.from);
      const bottom = Math.min(item.to, item.from);

      if (!max || !min) {
        max = top;
        min = bottom;
        preIndex++;
        continue;
      }

      max = Math.max(max, top);
      min = Math.min(min, bottom);

      preIndex++;
    }

    const peekDelta = max - min;

    const content = [];
    let index = 0;
    for (const item of data) {
      const right = (index + 1) * candleWidth + index * candleGap + this.state.right;
      const left = stageWidth - right;

      if (left + candleWidth < 0) break;
      if (left + candleWidth > stageWidth - rightMargin) {
        index++;
        continue;
      }

      const topValue = item.delta < 0 ? item.from : item.to;
      const topDelta = max - topValue;
      const top = topDelta * ((stageHeight - headMargin) / peekDelta) + headMargin / 2;

      const height = Math.abs((item.delta / peekDelta) * (stageHeight - headMargin));
      content.push(
        <Rect
          x={left}
          y={top}
          width={candleWidth}
          height={height}
          fill={item.delta > 0 ? Color.RED : Color.BLUE}
          cornerRadius={4}
          key={index}
        />
      );
      index++;
    }

    const lines = [];
    let interval: number = Infinity;
    if (peekDelta > 10_000_000) {
      interval = 2_000_000;
    } else if (peekDelta > 5_000_000) {
      interval = 1_000_000;
    } else if (peekDelta > 1_000_000) {
      interval = 500_000;
    } else if (peekDelta > 500_000) {
      interval = 100_000;
    } else if (peekDelta > 100_000) {
      interval = 50_000;
    } else {
      interval = 5_000;
    }

    for (let piece = interval; piece < max; piece = piece + interval) {
      if (piece < min) continue;
      const line = (
        <Line
          points={[
            0,
            ((max - piece) * (stageHeight - headMargin)) / peekDelta + headMargin / 2,
            stageWidth - rightMargin,
            ((max - piece) * (stageHeight - headMargin)) / peekDelta + headMargin / 2,
          ]}
          stroke={Color.LIGHT_GRAY}
          strokeWidth={1}
          key={piece + 'l'}
        />
      );
      const text = (
        <Text
          x={stageWidth - squareWidth}
          y={
            ((max - piece) * (stageHeight - headMargin)) / peekDelta +
            headMargin / 2 -
            squareHeight / 2 +
            (squareHeight - textSize) / 2
          }
          width={squareWidth}
          height={squareHeight}
          fontSize={textSize}
          text={Transform.addComma(piece || 0)}
          fontFamily={'Product Sans, sans-serif'}
          fill={Color.GRAY}
          align={'center'}
          key={piece + 't'}
        />
      );
      lines.push(line, text);
    }

    const mouseAmount = Transform.round(
      max - ((this.state.mouseY - headMargin / 2) / (stageHeight - headMargin)) * peekDelta,
      0
    );
    const mouseLine = (
      <Line
        points={[0, this.state.mouseY, stageWidth - rightMargin, this.state.mouseY]}
        stroke={Color.ORGANGE}
        strokeWidth={2}
        dash={[4, 4]}
      />
    );
    const mouseSquare = (
      <Rect
        x={stageWidth - squareWidth}
        y={this.state.mouseY - squareHeight / 2}
        width={squareWidth}
        height={squareHeight}
        fill={Color.ORGANGE}
        cornerRadius={8}
      />
    );
    const mouseText = (
      <Text
        x={stageWidth - squareWidth}
        y={this.state.mouseY - (squareHeight - textSize) / 2}
        width={squareWidth}
        height={squareHeight}
        fontSize={textSize}
        text={Transform.addComma(parseInt(mouseAmount))}
        fontFamily={'Product Sans, sans-serif'}
        fontStyle={'700'}
        fill={Color.WHITE}
        align={'center'}
      />
    );

    return (
      <Layout
        ref={ref => ref && (this.container = ref)}
        onWheel={this.onWheelEvent}
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
        onMouseOut={this.onMouseUp}
        onMouseMove={this.onMouseMove}
      >
        <Stage width={stageWidth} height={stageHeight}>
          <Layer>
            <Line
              points={[1, 1, stageWidth - rightMargin, 1]}
              stroke={Color.LIGHT_GRAY}
              strokeWidth={2}
            />
            <Line points={[1, 0, 1, stageHeight]} stroke={Color.LIGHT_GRAY} strokeWidth={2} />
            <Line
              points={[0, stageHeight - 1, stageWidth - rightMargin, stageHeight - 1]}
              stroke={Color.LIGHT_GRAY}
              strokeWidth={2}
            />
            <Line
              points={[stageWidth - rightMargin, stageHeight, stageWidth - rightMargin, 0]}
              stroke={Color.LIGHT_GRAY}
              strokeWidth={2}
            />
            <Line
              points={[0, headMargin / 2, stageWidth - rightMargin, headMargin / 2]}
              stroke={Color.RED}
              strokeWidth={2}
              dash={[2, 2]}
            />
            <Line
              points={[
                0,
                stageHeight - headMargin / 2,
                stageWidth - rightMargin,
                stageHeight - headMargin / 2,
              ]}
              stroke={Color.BLUE}
              strokeWidth={2}
              dash={[2, 2]}
            />
            {lines}

            <Rect
              x={stageWidth - squareWidth}
              y={headMargin / 2 - squareHeight / 2}
              width={squareWidth}
              height={squareHeight}
              fill={Color.RED}
              cornerRadius={8}
            />
            <Text
              x={stageWidth - squareWidth}
              y={headMargin / 2 - squareHeight / 2 + (squareHeight - textSize) / 2}
              width={squareWidth}
              height={squareHeight}
              fontSize={textSize}
              text={Transform.addComma(max || 0)}
              fontFamily={'Product Sans, sans-serif'}
              fill={Color.WHITE}
              align={'center'}
            />

            <Rect
              x={stageWidth - squareWidth}
              y={stageHeight - headMargin / 2 - squareHeight / 2}
              width={squareWidth}
              height={squareHeight}
              fill={Color.BLUE}
              cornerRadius={8}
            />
            <Text
              x={stageWidth - squareWidth}
              y={stageHeight - headMargin / 2 - squareHeight / 2 + (squareHeight - textSize) / 2}
              width={squareWidth}
              height={squareHeight}
              fontSize={textSize}
              text={Transform.addComma(min || 0)}
              fontFamily={'Product Sans, sans-serif'}
              fill={Color.WHITE}
              align={'center'}
            />

            <Rect
              x={stageWidth - squareWidth}
              y={
                ((max - lastAmount) * (stageHeight - headMargin)) / peekDelta +
                headMargin / 2 -
                squareHeight / 2
              }
              width={squareWidth}
              height={squareHeight}
              fill={Color.LIGHT_GRAY}
              cornerRadius={8}
            />
            <Text
              x={stageWidth - squareWidth}
              y={
                ((max - lastAmount) * (stageHeight - headMargin)) / peekDelta +
                headMargin / 2 -
                squareHeight / 2 +
                (squareHeight - textSize) / 2
              }
              width={squareWidth}
              height={squareHeight}
              fontSize={textSize}
              text={Transform.addComma(lastAmount || 0)}
              fontFamily={'Product Sans, sans-serif'}
              fontStyle={'700'}
              fill={Color.BLACK}
              align={'center'}
            />
            <Line
              points={[
                0,
                ((max - lastAmount) * (stageHeight - headMargin)) / peekDelta + headMargin / 2,
                stageWidth - rightMargin,
                ((max - lastAmount) * (stageHeight - headMargin)) / peekDelta + headMargin / 2,
              ]}
              stroke={Color.GRAY}
              strokeWidth={2}
              dash={[2, 2]}
            />

            {mouseLine}
            {mouseSquare}
            {mouseText}

            {content}
          </Layer>
        </Stage>
      </Layout>
    );
  }
}
