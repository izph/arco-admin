import React, { useEffect, useRef, useState } from 'react';

// 引入地图的资源
import {
    mapMap,
    MapView,
    Expand,
    CoordinateConversion,
    GraphicsLayer,
    Sketch,
    DistanceMeasurement2D,
    AreaMeasurement2D
} from '../arcgis.modules';


import useLocale from '@/utils/useLocale';
import locale from './locale';
import styles from './style/index.module.less';

function ArcgisMap() {
    const t = useLocale(locale);
    const viewDivRef = useRef<HTMLDivElement>(null);

    /**
     * measurement 是 arcgis地图测量对象
     * view是 arcgis地图各模块的对象
     */
    const [measurement, setMeasurement] = useState({
        widgetType: '', // 测量类型
        view: null, // 地图的交互对象
        activeWidget: null, // 当前测量对象
    })

    const createMap = () => {
        // 创建底图
        const map = new mapMap({
            basemap: 'osm'
        });
        // 画图图层
        const graphicsLayer = new GraphicsLayer();
        // view操作图层
        const view = new MapView({
            map: map,
            center: [103.70883648437736, 32.80943244626907],
            zoom: 4,
            container: viewDivRef.current,
        });

        // 地图加载完成时
        view.when(() => {
            // 坐标小部件
            const locateWidget = new CoordinateConversion({
                view: view
            });
            const locateExpand = new Expand({
                view: view,
                content: locateWidget,
                expandTooltip: t['menu.map.arcgis.coordinateTip'],
                expandIconClass: "esri-icon-locate",
                expanded: false,
                group: "top-left"
            });
            // 多功能画图小部件
            const sketch = new Sketch({
                layer: graphicsLayer,
                view: view,
                // graphic will be selected as soon as it is created
                creationMode: "update",
                visibleElements: {
                    createTools: {
                        point: true,
                        circle: true,
                    },
                    undoRedoMenu: true,
                    selectionTools: {
                        "lasso-selection": false
                    },
                    settingsMenu: true
                },

            });
            const sketchExpand = new Expand({
                view: view,
                content: sketch,
                expandTooltip: t['menu.map.arcgis.sketchExpandTip'],
                expandIconClass: "esri-icon-edit",
                expanded: false,
                group: "top-left"
            });
            view.ui.add(locateExpand, "top-left");
            view.ui.add(sketchExpand, "top-left");
            // 将测距按钮添加到地图左上角
            view.ui.add("distanceButton", "top-left");
            // 将测面按钮添加到地图左上角
            view.ui.add("areaButton", "top-left");
        });

        // 初始化 测距、测面的对象
        setMeasurement((measurement) => {
            return {
                ...measurement,
                view,
            }
        })

        return map;
    }

    // 设置测量类型  view, activeWidget当前测量对象, widgetType测量类型
    const setWidgetType = (view, activeWidget, widgetType) => {

        switch (widgetType) {
            // 如果是测量距离
            case "distance":
                activeWidget = new DistanceMeasurement2D({
                    view: view
                });
                // 跳过初始"新测量"按钮
                activeWidget.viewModel.start();
                // 将测量信息放到 左下角
                view.ui.add(activeWidget, "bottom-left");
                // 
                setActiveButton(document.getElementById("distanceButton"), view);
                setMeasurement((measurement) => {
                    return {
                        ...measurement,
                        activeWidget
                    }
                })
                break;
            case "area":
                activeWidget = new AreaMeasurement2D({
                    view: view
                });
                // 跳过初始"新测量"按钮
                activeWidget.viewModel.start();
                // 将测量信息放到 左下角
                view.ui.add(activeWidget, "bottom-left");
                setActiveButton(document.getElementById("areaButton"), view);
                setMeasurement((measurement) => {
                    return {
                        ...measurement,
                        activeWidget
                    }
                })
                break;
            //case null:
            default:
                if (activeWidget) {
                    // 清除测量对象
                    view.ui.remove(activeWidget);
                    activeWidget.destroy();
                    setMeasurement((measurement) => {
                        return {
                            ...measurement,
                            activeWidget: null
                        }
                    })
                }
                break;
        }
    }
    // 设置 active的 button
    const setActiveButton = (selectedButton, view) => {
        // 聚焦视图以激活用于绘制草图的键盘快捷键
        view.focus();
        // classList 返回所选元素的类名，是一个数组
        const elements = document.getElementsByClassName("active");
        for (let i = 0; i < elements.length; i++) {
            // 为元素删除 active 类名
            elements[i].classList.remove("active");
        }
        if (selectedButton) {
            // 为元素添加 active 类名
            selectedButton.classList.add("active");
        }
    }


    // 测距按钮
    const calculateDistance = (e) => {
        const { view, activeWidget } = measurement;
        // 每一次点击
        setWidgetType(view, activeWidget, null);
        // 目标元素(测距按钮)  的类名不包含 active
        if (!e.target.classList.contains("active")) {
            setWidgetType(view, activeWidget, 'distance');
        } else {
            // 如果已经处于 active 状态，再点击按钮，则清除当前测距数据
            setActiveButton(null, view);
        }


    }

    // 测面按钮
    const calculateArea = (e) => {
        const { view, activeWidget } = measurement;
        setWidgetType(view, activeWidget, null);
        // 目标元素(测面按钮) 的类名不包含 active
        if (!e.target.classList.contains("active")) {
            setWidgetType(view, activeWidget, 'area');
        } else {
            // 如果已经处于 active 状态，再点击按钮，则清除当前测面数据
            setActiveButton(null, view);
        }

    }

    // 清除测量数据按钮
    // const clearMeasurement = () => {
    //     const { activeWidget, view } = measurement;
    //     // 清除测量
    //     setMeasurementNull(activeWidget, view);
    //     // 去掉active
    //     setActiveButton(null, view);
    // }

    // 清空测量
    // const setMeasurementNull = (activeWidget, view) => {
    //     if (activeWidget) {
    //         activeWidget.viewModel.clear();
    //         view.ui.remove(activeWidget);
    //         activeWidget.destroy();
    //         setMeasurement((measurement) => {
    //             return {
    //                 ...measurement,
    //                 activeWidget: null
    //             }
    //         });
    //     }
    // }

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
            <button
                className={`${styles.actionButton}  esri-icon-measure-line`}
                id="distanceButton"
                title={t['menu.map.arcgis.distanceButtonTip']}
                onClick={calculateDistance}
            ></button>
            <button
                className={`${styles.actionButton} esri-icon-measure-area`}
                id="areaButton"
                title={t['menu.map.arcgis.areaButtonTip']}
                onClick={calculateArea}
            ></button>
        </div>
    )
}

export default ArcgisMap;