import React, { Component, MouseEvent, WheelEvent } from 'react';
import { Layer, Rect, Stage } from 'react-konva';
import styled from 'styled-components';
import { Color } from '../styles/color';

function parseCandleData(data: number[], timestamp: number[]): CandleData[] {
  const result: CandleData[] = [];

  let lastAmount = data[0];

  let index = 0;
  for (const item of data.slice(1)) {
    result.push({
      to: lastAmount,
      from: item,
      delta: lastAmount - item,
      timestamp: new Date(timestamp[index]),
    });
    lastAmount = item;
    index++;
  }

  return result;
}

const Layout = styled.div`
  width: 100%;
  height: 100%;
`;

interface Props {
  data: number[];
  timestamp: number[];
}

interface State {
  stageSize: [number, number];
  zoom: number;
  right: number;
}

interface CandleData {
  to: number;
  from: number;
  delta: number;
  timestamp: Date;
}

const candleWidthWeight = 10;
const candleGapWeight = 5;
const headMargin = 36;

export default class Chart extends Component<Props, State> {
  static defaultProps = {
    right: 0,
  };

  container!: HTMLDivElement;
  mouseDown: boolean = false;
  lastMouseX: number | null = null;

  constructor(props: any) {
    super(props);
    this.state = {
      stageSize: [100, 100],
      zoom: 1,
      right: 0,
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

    const data = parseCandleData(this.props.data, this.props.timestamp);

    let max: any, min: any;
    let preIndex = 0;
    for (const item of data) {
      const right = (preIndex + 1) * candleWidth + preIndex * candleGap + this.state.right;
      const left = stageWidth - right;

      if (left + candleWidth < 0) break;
      if (left > stageWidth) {
        preIndex++;
        continue;
      }

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
      if (left > stageWidth) {
        index++;
        continue;
      }

      const topValue = item.delta < 0 ? item.from : item.to;
      const topDelta = max - topValue;
      const top = topDelta * (stageHeight / peekDelta);

      const height = Math.abs((item.delta / peekDelta) * stageHeight);
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
          <Layer>{content}</Layer>
        </Stage>
      </Layout>
    );
  }
}
