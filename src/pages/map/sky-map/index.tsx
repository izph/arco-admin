import React, { useEffect, useRef } from 'react';

// 引入地图的资源——start
import {
    mapMap,
    MapView,
    WebTileLayer,
    Basemap,
    tileInfo,
    spatialReference
} from '../arcgis.modules'
// 引入地图的资源——end
import styles from './style/index.module.less';

function SkyMap() {
    //const t = useLocale(locale);
    const viewDivRef = useRef<HTMLDivElement>(null);

    const createMap = () => {
        // 加载天地矢量图
        const webTileLayer = new WebTileLayer({
            urlTemplate:
                "http://t0.tianditu.com/vec_w/wmts?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&LAYER=vec&STYLE=default&FORMAT=tiles&TILEMATRIXSET=w&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&tk=9048e3557f7dc2f685ad20984a1a3ac6",
            subDomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
            tileInfo: tileInfo,
            spatialReference
        } as WebTileLayer);

        // 底图
        const qdBaseMap = new Basemap({
            baseLayers: [webTileLayer],
            title: "SkyMap",
        });
        const map = new mapMap({
            basemap: qdBaseMap
        })

        new MapView({
            map: map,
            center: [103.70883648437736, 32.80943244626907],
            zoom: 4,
            container: viewDivRef.current,

        })

        return map;
    }

    // 加载地图
    useEffect(() => {
        const map = createMap();
        return () => {
            map && map.destroy();
        }
    }, [])

    return (
        <div>
            <div id="viewDiv" ref={viewDivRef} className={styles.viewDiv}></div>
        </div>
    )
}

export default SkyMap;