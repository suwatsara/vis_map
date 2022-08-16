import React, { useEffect, useState, useCallback } from 'react';
import { styled, withStyles } from '@mui/styles';
import Slider from '@mui/material/Slider';
import '../controls.css'
import Button from '@mui/material/IconButton';
import PlayIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { throttle, debounce } from "lodash";


const PositionContainer = styled('div')({
  position: 'absolute',
  zIndex: 101,
  bottom: '36px',
  width: '400px',
  left: '24px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',

});

const SliderInput = styled(Slider)({
  color: '#9a6fb0',
  height: 8,
  marginTop:5,
  marginLeft: 10,
  '& .MuiSlider-rail': {
    color: '#9a6fb0'
  },
  '& .MuiSlider-mark' : {
    color: '#fff'
  },
  '& .MuiSlider-track': {
    color: '#9a6fb0',
    border: 'none',
  },
  '& .MuiSlider-thumb': {
    height: 14,
    width: 14,
    backgroundColor: '#9160ab',
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: 'inherit',
    },
    '&:before': {
      display: 'none',
    },

    '& .MuiSlider-valueLabel': {
      lineHeight: 1.2,
      fontSize: 8,
      background: 'unset',
      padding: 0,
      width: 30,
      height: 20,
      backgroundColor: '#9a6fb0',
    },
  },

})



const PlayStyle = styled(PlayIcon)({
  color: '#9a6fb0'
})

const PauseStyle = styled(PauseIcon)({
  color: '#9a6fb0'
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

  const changeHandler = (e, newValue) => {
    onChange(newValue)
  }

  const debounceChangeHandler = useCallback(
    debounce(changeHandler, 100)
    , []);


  return (
    <PositionContainer>
      <Button disabled={!isButtonEnabled} onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? <PauseStyle title="Stop" /> : <PlayStyle title="Animate" />}
      </Button>
      <SliderInput
        min={min}
        max={max}
        step={3600000}
        value={value}
        marks={true}
        onChange={debounceChangeHandler}
        valueLabelDisplay="auto"
        valueLabelFormat={formatLabel}
      />
    </PositionContainer>


  );
}

