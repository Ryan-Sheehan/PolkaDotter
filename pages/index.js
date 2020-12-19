import Head from 'next/head'
import styles from '../styles/Home.module.css'


import React, {Component, useState} from 'react';
import { render } from 'react-dom';
import { Stage, Layer, Star, Circle, Text, Image } from 'react-konva';

import {

  isBrowser,
  isMobile
} from "react-device-detect";

function generateShapes() {
  return 
}

const INITIAL_STATE = generateShapes();

class Shapes extends Component  {
  
  constructor(props) {
    super(props);
    this.height = 0;
    this.width = 0;
    this.colors = ["#BA181B","#F99D1D","#006C33","#066CBB", "#F2EFEE"]
    this.stageRef = React.createRef(null);
    if (typeof window !== "undefined") {
      this.height = window.innerHeight;
      this.width = window.innerWidth;
    }
    this.state = {
      stars: [...Array(this.props.count)].map((_, i) => ({
          id: i.toString(),
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        color: this.getColor(),
        rotation: Math.random() * 180,
        isDragging: false,
      })),
      count: this.props.count,
    }
    
  }

  getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
  }

  getColor = () => {
    console.log(this.colors)
    return this.colors[this.getRandomInt(this.colors.length)]
  }
  componentDidUpdate(prevProps) {
    if (prevProps.count !== this.props.count) {
      this.setState({
        stars: [...Array(this.props.count)].map((_, i) => ({
          id: i.toString(),
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        color: this.getColor(),
        rotation: Math.random() * 180,
        isDragging: false,
      }))
      })
    }
  }


 
  
  handleDragStart = (e) => {
    const id = e.target.id();
    this.setState({stars:
      this.state.stars.map((star) => {
        return {
          ...star,
          isDragging: star.id === id,
        };
      })}
    )
  };
  handleDragEnd = (e) => {
    this.setState({stars:
      this.state.stars.map((star) => {
        return {
          ...star,
          isDragging: false,
        };
      })}
    )
  };
  downloadURI(uri, name) {
  var link = document.createElement('a');
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  }
  handleExport = () => {
    const uri = this.stageRef.current.toDataURL();
    console.log(uri);
    
    this.downloadURI(uri, 'polka.png');
  };
  render() {
  const {stars} = this.state;
  return (
    <Stage width={this.width} height={this.height} ref={this.stageRef}>
      <Layer>
        {this.props.children}
        {stars.map((star) => (
          <Circle
            key={star.id}
            id={star.id}
            x={star.x}
            y={star.y}
            radius={this.props.size}
            fill={star.color}
            opacity={0.9}
            draggable
            rotation={star.rotation}
            
            scaleX={star.isDragging ? 1.2 : 1}
            scaleY={star.isDragging ? 1.2 : 1}
            onDragStart={this.handleDragStart}
            onDragEnd={this.handleDragEnd}
          />
        ))}
        
      </Layer>
    </Stage>
  );}
};


export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dotCounter: 10,
      dotSize: 40,
      selectedImage: null,
      preview: null
    }
    this.height = 0;
    this.width = 0;
    this.child = React.createRef();
    
    if (typeof window !== "undefined") {
      this.height = window.innerHeight;
      this.width = window.innerWidth;
    }
  }

  increaseDotCounter = () => {
    this.setState({dotCounter: this.state.dotCounter + 1})
  }
  decreaseDotCounter = () => {
    if (this.state.dotCounter >= 1) {
      this.setState({dotCounter: this.state.dotCounter - 1})
    }
  }
  increaseDotSize = () => {
    this.setState({dotSize: this.state.dotSize + 5})
  }
  decreaseDotSize = () => {
    if (this.state.dotSize >= 5) {
      this.setState({dotSize: this.state.dotSize - 5})
    } 
  }
  onSelectFile = (e) => {
        if (!e.target.files || e.target.files.length === 0) {
            this.setState({selectedImage: null})
            return
        }
        const objectUrl = URL.createObjectURL(e.target.files[0])
        this.image = new window.Image();
        this.image.src = objectUrl;

        this.image.addEventListener('load', this.handleLoad);
        
        this.setState({selectedImage: e.target.files[0]})

  }
  handleLoad = () => {
    
    this.setState({preview: this.image, 
      imageHeight: this.image.naturalHeight,
      imageWidth: this.image.naturalWidth})
    
  };

  onClick = () => {
    this.child.current.handleExport();
  };
  
  


  render() {

  const {dotCounter, dotSize, selectedImage, preview, imageHeight, imageWidth} = this.state;
  return (
    <div className={styles.container}>
      <Head>
        <title>Polka Dotter</title>
        <meta property="og:title" content="Polka Dotter"/>
        <meta property="og:description" content="Polka dot your images, all the cool kids are doing it"/>
        <meta property="og:image" content="/polka-meta.png"/>
        <meta property="og:url" content="http://polka.vercel.app"/>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Shapes count={dotCounter} size={dotSize} ref={this.child}>
        <Image
        x={20}
        y={100}
        width={this.width - 40}
        height={(imageHeight * (this.width - 40)) / imageWidth}
        image={preview}
        ref={node => {
          this.imageNode = node;
        }}
      />
      </Shapes>
      
      <div className="upload"><label>Open Image</label>
      <input className="upload-inner" type="file" onChange={this.onSelectFile} /></div>
            
      <div className="save">Polka dot your image</div>

      <div className={"form"}>
      <div className={"form-row label"}>Dot Count</div>
      <div className={"form-row"}>
        <div className="num-button minus" onClick={() => this.decreaseDotCounter()}>-</div>
        <div className="num">{dotCounter}</div>
        <div className="num-button plus" onClick={() => this.increaseDotCounter()}>+</div>
      </div>
      <div className={"form-row label"}>Dot Size</div>
      <div className={"form-row"}>
        <div className="num-button minus" onClick={() => this.decreaseDotSize()}>-</div>
        <div className="num">{dotSize}</div>
        <div className="num-button plus" onClick={() => this.increaseDotSize()}>+</div>
      </div>
      <div className={"form-row"}>
      <div className={"save-button"} onClick={this.onClick}>
        Save Image
      </div>
      </div>
      </div>

    </div>
  )
}
}
