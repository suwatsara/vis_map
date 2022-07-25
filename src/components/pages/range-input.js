import React, { useEffect, useState } from 'react';
import { styled, withStyles } from '@mui/styles';
import Slider from '@mui/material/Slider';
import '../../controls.css'
import Button from '@mui/material/IconButton';
import PlayIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';



const PositionContainer = styled('div')({
  position: 'absolute',
  zIndex: 1,
  bottom: '40px',
  width: '50%',
  left: '25%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
});

const SliderInput = styled(Slider)({
  color: '#d46a6a',
  height: 8,
  '& .MuiSlider-track': {
    border: 'none',
  },
  '& .MuiSlider-rail':{
    color:'#d46a6a'
  },
  '& .MuiSlider-track':{
    color:'#d46a6a'
  },
  '& .MuiSlider-thumb': {
    height: 18,
    width: 18,
    backgroundColor: '#d14343',
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: 'inherit',
    },
    '&:before': {
      display: 'none',
    },

    '& .MuiSlider-valueLabel': {
      lineHeight: 1.2,
      fontSize: 10,
      background: 'unset',
      padding: 0,
      width: 34,
      height: 34,
      backgroundColor: '#d46a6a',
    },
  },

})


const PlayStyle = styled(PlayIcon)({
  color:'#d14343'
})

const PauseStyle = styled(PauseIcon)({
  color:'#d14343'
})

export default function RangeInput({ min, max, value, animationSpeed, onChange, formatLabel }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [animation] = useState({});

  // prettier-ignore
  useEffect(() => {
    return () => animation.id && cancelAnimationFrame(animation.id);
  }, [animation]);

  if (isPlaying && !animation.id) {
    const span = value[1] - value[0];
    let nextValueMin = value[0] + animationSpeed;
    if (nextValueMin + span >= max) {
      nextValueMin = min;
    }
    animation.id = requestAnimationFrame(() => {
      animation.id = 0;
      onChange([nextValueMin, nextValueMin + span]);
    });
  }

  const isButtonEnabled = value[0] > min || value[1] < max;


  return (
      <PositionContainer>
        <Button color="primary" disabled={!isButtonEnabled} onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? <PauseStyle title="Stop" /> : <PlayStyle title="Animate" />}
        </Button>
        <SliderInput
          min={min}
          max={max}
          step={3600000}
          value={value}
          marks={true}
          onChange={e=> onChange(e.target.value)}
          valueLabelDisplay="on"
          valueLabelFormat={formatLabel}
        />
      </PositionContainer>


  );
}

