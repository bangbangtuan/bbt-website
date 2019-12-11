import React from "react";
import img1 from '../../images/luobo/1.jpeg';
import img2 from '../../images/luobo/2.jpeg';
import img3 from '../../images/luobo/3.jpeg';
import img4 from '../../images/luobo/4.jpeg';
import img5 from '../../images/luobo/5.jpeg';
import './Carousel.css'

class Carousel extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            dir: [
                { name: 'middle' },
                { name: 'start' },
                { name: 'normal' },
                { name: 'normal2' },
                { name: 'end' },
            ]
        };
    }

    slide(name, key) {  // 图片点击逻辑
        // 记录当前节点
        this.setState({ current: key });
        // 数组操作方法
        this.imgArr(name);
    }

    imgArr(name) { // 数组处理
        let dirCopy = this.state.dir;
        if (name === 'start') {  // 点击左侧那张
            const pop = dirCopy.pop(); // 从数组尾部弹出一个元素
            dirCopy.unshift(pop); // 尾部元素添加到数组头部
        } else if (name === 'end') { // 点击右侧那张
            const shift = dirCopy.shift(); // 从数组头部弹出一个元素
            dirCopy.push(shift);  // 添加到数组尾部
        }
        this.setState({ dir: dirCopy }); // 保存重新排列的数组 并触发render
    }

    render() {
        const imgsArr = [img1,img2,img3,img4,img5];
        const { dir } = this.state;
        return (
            <div className='root'>
                <div className='slideBox'>
                    {
                        dir.map((item, key) => {
                            return (
                                <div className={`slide ${item.name}`} key={key}>
                                    <img src={`${imgsArr[key]}`} alt='xibao' />
                                    {/*此处偷懒 alt="./images/404.png"*/}
                                    <div
                                        className={item.name === 'middle' ? '' : 'masking'}
                                        onClick={() => this.slide(item.name, key)}
                                    >{''}</div>
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        );
    }
}

export default Carousel;
