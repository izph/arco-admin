import React from 'react';
import { Carousel } from '@arco-design/web-react';
import styles from './style/index.module.less';
import bg01 from './image/banner-bg01.png';
import bg02 from './image/banner-bg02.png';
import bg03 from './image/banner-bg03.png';

export default function LoginBannber() {
  const data = [
    {
      slogan: '开箱即用的高质量模板',
      subSlogan: '丰富的的页面模板，覆盖大多数典型业务场景',
      image: bg01,
    },
    {
      slogan: '内置了常见问题的解决方案',
      subSlogan: '国际化，路由配置，状态管理应有尽有',
      image: bg02,
    },
    {
      slogan: '接入可视化增强工具AUX',
      subSlogan: '实现灵活的区块式开发',
      image: bg03,
    },
  ];
  return (
    <Carousel
      className={styles.carousel}
      animation="fade"
      showArrow="hover"
      autoPlay={{ interval: 3000, hoverToPause: false }}
    >
      {data.map((item, index) => (
        <div key={`${index}`}>
          <div className={styles['carousel-item']}>
            {/* <div className={styles['carousel-title']}>
              <div className={styles['carousel-main-title']}>{item.slogan}</div>
              <div className={styles['carousel-sub-title']}>{item.subSlogan}</div>
            </div> */}
            <img
              alt="banner-image"
              className={styles['carousel-image']}
              src={item.image}
            />
          </div>
        </div>
      ))}
    </Carousel>
  );
}
