import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent {
  title = 'xCanvas';
  imgSrc = '';

  fileChange(fileList) {
    for (const file of fileList) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.createImage(reader);
      };
    }
  }

  createImage(obj) {
    let img = new Image();
    img.onload = () => {
      this.drawImage(img);
    };
    img.src = obj.result;
  }

  drawImage(img) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const width = 32,
      height = 32,
      size = 10;
    canvas.width = width * size;
    canvas.height = height * size;
    let w = img.width,
      h = img.height;
    const v = w / h;
    if (v > 1) {
      w = width;
      h = w / v;
    } else {
      h = height;
      w = h * v;
    }
    ctx.drawImage(
      img,
      ((width - w) / 2) * size,
      ((height - h) / 2) * size,
      w * size,
      h * size
    );
    let pxMap = [];
    for (let i = 0; i < width * size; i += size) {
      for (let j = 0; j < height * size; j += size) {
        let pixel = ctx.getImageData(i, j, 1, 1).data;
        let color = `rgba(${pixel[0]},${pixel[1]},${pixel[2]},${
          pixel[3] / 255
        })`;
        pxMap.push({ x: i / size, y: j / size, color });
      }
    }
    pxMap.forEach((px) => {
      const { color, x, y } = px;
      ctx.fillStyle = color;
      ctx.fillRect(x * size, y * size, size, size);
    });
    const base64Img = canvas.toDataURL('image/jpg');
    this.imgSrc = base64Img;
  }
}
