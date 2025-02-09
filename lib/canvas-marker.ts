import leaflet from 'leaflet';

leaflet.Canvas.include({
  updateCanvasImg(layer: CanvasMarker) {
    if (!layer.imageElement.complete) {
      return;
    }
    const ctx: CanvasRenderingContext2D = this._ctx;
    if (!ctx) {
      return;
    }
    const radius = layer.options.highlight
      ? layer.options.radius * 1.25
      : layer.options.radius;
    const p = layer._point.round();
    const imageSize = radius * 2;
    const dx = p.x - radius;
    const dy = p.y - radius;

    if (layer.options.highlight) {
      ctx.beginPath();
      ctx.arc(dx + radius, dy + radius, radius, 0, Math.PI * 2, true);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    ctx.drawImage(layer.imageElement, dx, dy, imageSize, imageSize);
  },
});
const renderer = leaflet.canvas() as leaflet.Canvas & {
  updateCanvasImg: (layer: CanvasMarker) => void;
};

export type CanvasMarkerOptions = {
  radius: number;
  src: string;
  highlight?: boolean;
};

const imageElements: {
  [src: string]: HTMLImageElement;
} = {};
class CanvasMarker extends leaflet.CircleMarker {
  declare options: leaflet.CircleMarkerOptions & CanvasMarkerOptions;
  private _renderer: typeof renderer;
  declare imageElement: HTMLImageElement;
  private _onImageLoad: (() => void) | undefined = undefined;
  declare _point: any;

  constructor(
    latLng: leaflet.LatLngExpression,
    options: leaflet.CircleMarkerOptions & CanvasMarkerOptions,
  ) {
    options.renderer = renderer;
    super(latLng, options);
    this._renderer = renderer;
    this._setImageElement(options.src);
  }

  _setImageElement(src: string) {
    if (!imageElements[src]) {
      imageElements[src] = document.createElement('img');
      imageElements[src].src = src;
    }
    this.imageElement = imageElements[src];
  }

  setSrc(src: string) {
    this._setImageElement(src);
    this.redraw();
  }

  _redraw() {
    return;
  }

  _update() {
    return;
  }

  _updatePath() {
    if (this.imageElement.complete) {
      this._renderer.updateCanvasImg(this);
    } else if (!this._onImageLoad) {
      this._onImageLoad = () => {
        this.imageElement.removeEventListener('load', this._onImageLoad!);
        this._renderer.updateCanvasImg(this);
      };
      this.imageElement.addEventListener('load', this._onImageLoad);
    }
  }
}

export default CanvasMarker;
