/********
 * dom 添加水印
 * settings.watermark_txt: 水印文字
 ***********/
const watermark = settings => {
  // 默认设置
  const defaultSettings = {
    watermark_txt: settings.watermark_txt,
    watermark_x: 20 as any, // 水印起始位置x轴坐标
    watermark_y: 20 as any, // 水印起始位置Y轴坐标
    watermark_rows: 120 as any, // 水印行数
    watermark_cols: 20 as any, // 水印列数
    watermark_x_space: 100 as any, // 水印x轴间隔
    watermark_y_space: 50 as any, // 水印y轴间隔
    watermark_color: '#aaa' as any, // 水印字体颜色
    watermark_alpha: 0.4 as any, // 水印透明度
    watermark_fontsize: '15px' as any, // 水印字体大小
    watermark_font: '微软雅黑' as any, // 水印字体
    watermark_width: 210 as any, // 水印宽度
    watermark_height: 80 as any, // 水印长度
    watermark_angle: 15 as any // 水印倾斜度数
  };
  var oTemp = document.createDocumentFragment();

  //获取页面最大宽度
  var page_width = Math.max(
    document.body.scrollWidth,
    document.body.clientWidth
  ) as any;
  var cutWidth = page_width * 0.015;
  page_width = page_width - cutWidth;
  //获取页面最大高度
  var page_height =
    Math.max(document.body.scrollHeight, document.body.clientHeight) + 450;
  // var page_height = document.body.scrollHeight+document.body.scrollTop;
  //如果将水印列数设置为0，或水印列数设置过大，超过页面最大宽度，则重新计算水印列数和水印x轴间隔
  if (
    defaultSettings.watermark_cols == 0 ||
    parseInt(
      defaultSettings.watermark_x +
      defaultSettings.watermark_width * defaultSettings.watermark_cols +
      defaultSettings.watermark_x_space * (defaultSettings.watermark_cols - 1)
    ) > page_width
  ) {
    defaultSettings.watermark_cols = parseInt(
      (page_width -
        defaultSettings.watermark_x +
        defaultSettings.watermark_x_space) /
      (defaultSettings.watermark_width + defaultSettings.watermark_x_space)
    );
    defaultSettings.watermark_x_space = parseInt(
      (page_width -
        defaultSettings.watermark_x -
        defaultSettings.watermark_width * defaultSettings.watermark_cols) /
      (defaultSettings.watermark_cols - 1)
    );
  }
  //如果将水印行数设置为0，或水印行数设置过大，超过页面最大长度，则重新计算水印行数和水印y轴间隔
  if (
    defaultSettings.watermark_rows === 0 ||
    parseInt(
      defaultSettings.watermark_y +
      defaultSettings.watermark_height * defaultSettings.watermark_rows +
      defaultSettings.watermark_y_space * (defaultSettings.watermark_rows - 1)
    ) > page_height
  ) {
    defaultSettings.watermark_rows = parseInt(
      (defaultSettings.watermark_y_space +
        page_height -
        defaultSettings.watermark_y) /
      (defaultSettings.watermark_height + defaultSettings.watermark_y_space)
    );
    defaultSettings.watermark_y_space =
      parseInt(
        page_height -
        defaultSettings.watermark_y -
        defaultSettings.watermark_height * defaultSettings.watermark_rows
      ) /
      (defaultSettings.watermark_rows - 1);
  }
  var x;
  var y;
  for (var i = 0; i < defaultSettings.watermark_rows; i++) {
    y =
      defaultSettings.watermark_y +
      (defaultSettings.watermark_y_space + defaultSettings.watermark_height) *
      i;
    for (var j = 0; j < defaultSettings.watermark_cols; j++) {
      x =
        defaultSettings.watermark_x +
        (defaultSettings.watermark_width + defaultSettings.watermark_x_space) *
        j;

      let mask_div = document.createElement('div') as any;
      mask_div.id = 'mask_div' + i + j;
      mask_div.className = 'mask_div';
      mask_div.appendChild(
        document.createTextNode(defaultSettings.watermark_txt)
      );
      //设置水印div倾斜显示
      mask_div.style.webkitTransform = 'rotate(15deg)';
      mask_div.style.MozTransform = 'rotate(15deg)';
      mask_div.style.msTransform = 'rotate(15deg)';
      mask_div.style.OTransform = 'rotate(15deg)';
      mask_div.style.transform = 'rotate(15deg)';
      mask_div.style.visibility = '';
      mask_div.style.position = 'absolute';
      mask_div.style.left = x + 'px';
      mask_div.style.top = y + 'px';
      mask_div.style.overflow = 'hidden';
      mask_div.style.zIndex = '9999';
      mask_div.style.pointerEvents = 'none'; // pointer-events:none  让水印不遮挡页面的点击事件
      //mask_div.style.border="solid #eee 1px";
      mask_div.style.opacity = defaultSettings.watermark_alpha;
      mask_div.style.fontSize = defaultSettings.watermark_fontsize;
      mask_div.style.fontFamily = defaultSettings.watermark_font;
      mask_div.style.color = defaultSettings.watermark_color;
      mask_div.style.textAlign = 'center';
      mask_div.style.width = defaultSettings.watermark_width + 'px';
      mask_div.style.height = defaultSettings.watermark_height + 'px';
      mask_div.style.display = 'block';
      oTemp.appendChild(mask_div);
    }
  }
  return oTemp;
};

/********
 * canvas制作水印
 * str: 水印文字
 * ele: dom
 ***********/
const canvasWaterMarker = (str, ele) => {
  var can = document.createElement('canvas');
  ele.appendChild(can);
  can.width = 300;
  can.height = 200;
  can.style.display = 'none';
  const cans = can.getContext('2d');
  cans.rotate((-20 * Math.PI) / 180);
  cans.font = '14px Microsoft JhengHei';
  cans.fillStyle = 'rgba(17, 17, 17, 0.50)';
  cans.textAlign = 'left';
  cans.textBaseline = 'Middle';
  cans.fillText(str, can.width / 3, can.height / 2);

  ele.style.backgroundImage = `url(${can.toDataURL('image/png')})`;
};

/********
 * svg制作水印
 * str: 水印文字
 * ele: dom
 ***********/
const svgWaterMarker = (str, ele) => {
  const [txt, x, y, width, height, color, fontSize, angle] = [
    str,
    100,
    100,
    300,
    200,
    'rgb(0,0,0,0.15)',
    '14px',
    -30
  ];
  const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}px" height="${height}px">
                <text x="${x}px" y="${y}px" dy="${fontSize}px"
                    text-anchor="start"
                    stroke="${color}"
                    fill="none"
                    transform="rotate(${angle},${x} ${y})"
                    font-weight="100"
                    font-size="${fontSize}"
                    >
                    ${txt}
                </text>
            </svg>`;
  ele.style.backgroundImage = `url(data:image/svg+xml;base64,${window.btoa(
    unescape(encodeURIComponent(svgStr))
  )})`;
};
