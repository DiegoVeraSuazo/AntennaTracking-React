import React from 'react';
import axios from 'axios';
import { Box, IconButton, Paper } from '@mui/material';
import NorthIcon from '@mui/icons-material/North';
import SouthIcon from '@mui/icons-material/South';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import NorthWestIcon from '@mui/icons-material/NorthWest';
import NorthEastIcon from '@mui/icons-material/NorthEast';
import SouthWestIcon from '@mui/icons-material/SouthWest';
import SouthEastIcon from '@mui/icons-material/SouthEast';

const ControlAntenna = () => {
  const moveAntenna = async (direction) => {
    try {
      const urlMap = {
        left: 'moveLeft',
        right: 'moveRight',
        up: 'moveUp',
        down: 'moveDown',
        leftUp: 'moveLeftUp',
        rightUp: 'moveRightUp',
        leftDown: 'moveLeftDown',
        rightDown: 'moveRightDown',
        stop: 'stop'
      };
      const url = `http://192.168.1.18:5019/${urlMap[direction]}`;
      await axios.get(url);
    } catch (error) {
      console.error(`Error moving antenna ${direction}:`, error);
    }
  };

  return (
    <Paper
      elevation={24}
      sx={{
        width: 'auto',
        padding: 3,
        borderRadius: 2,
        bgcolor: 'white',
      }}
    >
        <Box display="flex" flexDirection="column" alignItems="center">
        <h2>Control de la Antena</h2>
        <Box display="flex" flexDirection="column" alignItems="center">
            <Box display="flex" justifyContent="center">
            <IconButton onClick={() => moveAntenna('leftUp')} sx={{ boxShadow: 3, margin: 1 }}>
                <NorthWestIcon />
            </IconButton>
            <IconButton onClick={() => moveAntenna('up')} sx={{ boxShadow: 3, margin: 1 }}>
                <NorthIcon />
            </IconButton>
            <IconButton onClick={() => moveAntenna('rightUp')} sx={{ boxShadow: 3, margin: 1 }}>
                <NorthEastIcon />
            </IconButton>
            </Box>
            <Box display="flex" justifyContent="center">
            <IconButton onClick={() => moveAntenna('left')} sx={{ boxShadow: 3, margin: 1 }}>
                <WestIcon />
            </IconButton>
            <IconButton onClick={() => moveAntenna('stop')} sx={{ boxShadow: 3, margin: 1 }}>
                &#10070; {/* BLACK DIAMOND MINUS WHITE X https://www.toptal.com/designers/htmlarrows/symbols/black-diamond-minus-white-x/ */}
            </IconButton>
            <IconButton onClick={() => moveAntenna('right')} sx={{ boxShadow: 3, margin: 1 }}>
                <EastIcon />
            </IconButton>
            </Box>
            <Box display="flex" justifyContent="center">
            <IconButton onClick={() => moveAntenna('leftDown')} sx={{ boxShadow: 3, margin: 1 }}>
                <SouthWestIcon />
            </IconButton>
            <IconButton onClick={() => moveAntenna('down')} sx={{ boxShadow: 3, margin: 1 }}>
                <SouthIcon />
            </IconButton>
            <IconButton onClick={() => moveAntenna('rightDown')} sx={{ boxShadow: 3, margin: 1 }}>
                <SouthEastIcon />
            </IconButton>
            </Box>
        </Box>
        </Box>
    </Paper>
  );
};

export default ControlAntenna;
