import * as React from "react";
import styled from "styled-components";
import BScroll from "better-scroll";
import style from "dom-helpers/style";

const CarouselWrapper = styled.div`
  min-height: 1px;
`;

const CarouselContent = styled.div`
  height: 100%;
  position: relative;
  overflow: hidden;
  white-space: nowrap;
`;

export interface ICarouselProps {
  children: any;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
  interval?: number;
  dots?: boolean;
  threshold?: number;
  speed?: number;
}

export interface ICarouselState {
  dots: any[];
  currentPageIndex: number;
}

export class Carousel extends React.Component<ICarouselProps, ICarouselState> {
  static defaultProps = {
    loop: true,
    autoPlay: true,
    interval: 3000,
    showDot: true,
    click: true,
    threshold: 0.3,
    speed: 400,
  };

  state = {
    dots: [],
    currentPageIndex: 0,
  };

  resizeTimer: number = 0;
  timer: number = 0;

  ref: React.RefObject<any> = React.createRef();
  contentRef: React.RefObject<any> = React.createRef();
  carousel: BScroll | null = null;

  componentDidMount() {
    this.update();
    window.addEventListener("resize", this.onResize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.onResize);
  }

  componentDidUpdate(prevProps: ICarouselProps, prevState: ICarouselState) {
    if (prevProps !== this.props) {
      this.update();
    }
  }

  update() {
    if (this.carousel) {
      this.carousel.destroy();
    }

    setTimeout(() => {
      this.initial();
    });
  }

  onResize = () => {
    if (!this.carousel || !this.carousel.enabled) {
      return;
    }
    clearTimeout(this.resizeTimer);
    this.resizeTimer = window.setTimeout(() => {
      if (this.carousel && this.carousel.isInTransition) {
        this.onScrollEnd();
      } else {
        if (this.props.autoplay) {
          this.play();
        }
      }
      this.refresh();
    }, 60);
  };

  initial() {
    this.setWidth();
    if (this.props.dots) {
      this.initialDots();
    }
    this.initialScroll();
    if (this.props.autoplay) {
      this.play();
    }
  }

  refresh() {
    this.setWidth(true);
    if (this.carousel) {
      this.carousel.refresh();
    }
  }

  prev() {
    if (this.carousel) {
      this.carousel.prev();
    }
  }

  next() {
    if (this.carousel) {
      this.carousel.next();
    }
  }

  play() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      if (this.carousel) {
        this.carousel.next();
      }
    }, this.props.interval);
  }

  initialScroll() {
    this.carousel = new BScroll(this.ref.current, {
      scrollX: true,
      scrollY: false,
      momentum: false,
      snap: {
        loop: this.props.loop,
        threshold: this.props.threshold,
        speed: this.props.speed,
      },
      bounce: false,
      stopPropagation: false,
      click: true,
    });

    this.carousel.on("scrollEnd", this.onScrollEnd.bind(this));

    this.carousel.on("touchEnd", () => {
      if (this.props.autoplay) {
        this.play();
      }
    });

    this.carousel.on("beforeScrollStart", () => {
      if (this.props.autoplay) {
        clearTimeout(this.timer);
      }
    });
  }

  onScrollEnd() {
    if (this.carousel) {
      let pageIndex = this.carousel.getCurrentPage().pageX;
      this.setState({
        currentPageIndex: pageIndex,
      });
      if (this.props.autoplay) {
        this.play();
      }
    }
  }

  children: any[] = [];

  setWidth(isResize?: boolean) {
    this.children = this.contentRef.current.children;
    let width = 0;
    let carouselWidth = this.ref.current.clientWidth;
    for (let i = 0; i < this.children.length; i++) {
      let child = this.children[i];

      style(
        child,
        {
          float: "left",
          height: "100%",
          width: carouselWidth + "px",
        },
        undefined
      );
      width += carouselWidth;
    }
    if (this.props.loop && !isResize) {
      width += 2 * carouselWidth;
    }
    this.contentRef.current.style.width = width + "px";
  }

  initialDots() {
    const dots = new Array(this.props.children.length);
    this.setState({ dots });
  }

  render() {
    return (
      <CarouselWrapper className={this.props.className} ref={this.ref}>
        <CarouselContent ref={this.contentRef}>{this.props.children}</CarouselContent>
      </CarouselWrapper>
    );
  }
}

export default Carousel;
