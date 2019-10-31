export enum LayerPlacement {
  top = 'top',
  right = 'right',
  bottom = 'bottom',
  left = 'left',
  center = 'center',
  full = 'full'
}

export const getLayerContentValues = (placement: LayerPlacement) => {
  switch (placement) {
    case LayerPlacement.top:
      return {
        from: {
          x: 0,
          y: '-100%',
          scale: 1,
          opacity: 1,
          top: 0,
          left: 0,
          right: 0
        },
        enter: { y: '0%' }
      };

    case LayerPlacement.right:
      return {
        from: {
          x: '100%',
          y: 0,
          scale: 1,
          opacity: 1,
          top: 0,
          bottom: 0,
          right: 0
        },
        enter: { x: '0%' }
      };

    case LayerPlacement.bottom:
      return {
        from: {
          x: 0,
          y: '100%',
          scale: 1,
          opacity: 1,
          left: 0,
          bottom: 0,
          right: 0
        },
        enter: { y: '0%' }
      };

    case LayerPlacement.left:
      return {
        from: {
          x: '-100%',
          y: 0,
          scale: 1,
          opacity: 1,
          left: 0,
          bottom: 0,
          top: 0
        },
        enter: { x: '0%' }
      };

    case LayerPlacement.center:
      return {
        from: {
          x: '-50%',
          y: '-50%',
          scale: 0.8,
          opacity: 0,
          left: '50%',
          top: '50%'
        },
        enter: { scale: 1, opacity: 1 }
      };

    case LayerPlacement.full:
      return {
        from: {
          x: 0,
          y: '100%',
          scale: 1,
          opacity: 1,
          left: 0,
          top: 0,
          right: 0,
          bottom: 0
        },
        enter: { y: '0%' }
      };
  }
};
