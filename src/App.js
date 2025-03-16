import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Slider,
  Grid,
  Box,
  Typography,
} from "@mui/material";
import "./App.css";

const App = () => {
  const [input, setInput] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [captchaStage, setCaptchaStage] = useState(0);
  const [showSlider, setShowSlider] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const [triggerPrank, setTriggerPrank] = useState(false);

  useEffect(() => {
    if (!triggerPrank) return;

    const interval = setInterval(() => {
      setInput((prev) => prev.slice(1) + prev[0]);
    }, 100);

    const timeout = setTimeout(() => {
      setShowPopup(true);
    }, 25 * 10);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [triggerPrank]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const { key } = event;
      if (/^[0-9+\-*/.=]$/.test(key)) {
        handleButtonClick(key);
      } else if (key === "Enter") {
        handleButtonClick("=");
      } else if (key === "Backspace") {
        setInput((prev) => prev.slice(0, -1));
      } else if (key === "Escape") {
        setInput("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const closeAllPopups = () => {
    setShowPopup(false);
    setCaptchaStage(0);
    setShowSlider(false);
  };

  const handleNoClick = () => {
    closeAllPopups();
  };

  const handleYesClick = () => {
    setCaptchaStage(1);
    setShowPopup(false);
  };

  const handleCaptchaClick = () => {
    if (captchaStage < 50) {
      setCaptchaStage((prev) => prev + 1);
    } else {
      setCaptchaStage(51);
    }
  };

  const handleOkClick = () => {
    setShowSlider(true);
    setCaptchaStage(0);
  };

  const handleSliderChange = (event, value) => {
    setSliderValue(value);
    if (value === 100) {
      setTimeout(() => {
        document.body.innerHTML = `
          <iframe id="rickroll" width="100%" height="100%" 
            src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=0"
            frameborder="0" allow="autoplay; fullscreen"></iframe>
        `;

        const rickroll = document.getElementById("rickroll");
        if (rickroll.requestFullscreen) {
          rickroll.requestFullscreen();
        } else if (rickroll.webkitRequestFullscreen) {
          rickroll.webkitRequestFullscreen();
        } else if (rickroll.mozRequestFullScreen) {
          rickroll.mozRequestFullScreen();
        } else if (rickroll.msRequestFullscreen) {
          rickroll.msRequestFullscreen();
        }
      }, 500);
    }
  };

  const isOperator = (char) => ["+", "-", "*", "/"].includes(char);

  const handleButtonClick = (value) => {
    if (value === "=") {
      if (input) {
        setTriggerPrank(true);
        setInput("Generating Answer... Don't give up on your dreams! Talking with wizards! This MIGHT take a while. I AM MUSIC. Hold tight, just there! hmm. Activating my last braincells... ");
      }
    } else if (value === "C") {
      setInput("");
      setTriggerPrank(false);
      closeAllPopups();
    } else {
      if (input === "" && isOperator(value)) return;
      if (isOperator(value) && isOperator(input.slice(-1))) return;
      setInput((prev) => prev + value);
    }
  };

  return (
    <Container maxWidth="xs" className="calculator-container">
      <Typography variant="h5" align="center" sx={{ mb: 2, fontWeight: "bold" }}>
        The "Smartest" Calculator 🧠
      </Typography>

      <TextField
        variant="outlined"
        fullWidth
        value={input}
        inputProps={{
          style: { textAlign: "right", fontSize: "32px", color: "white" },
        }}
        disabled
        sx={{
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "gray !important" },
            "&:hover fieldset": { borderColor: "gray !important" },
            "&.Mui-focused fieldset": { borderColor: "gray !important" },
          },
          "& .MuiInputBase-input.Mui-disabled": {
            "-webkit-text-fill-color": "white",
          },
        }}
        style={{ marginTop: "5px", marginBottom: "15px" }}
      />

      <Grid container spacing={2} className="button-grid">
        {["7", "8", "9", "/"].map((btn) => (
          <Grid item xs={3} key={btn}>
            <Button fullWidth variant="contained" onClick={() => handleButtonClick(btn)}>
              {btn}
            </Button>
          </Grid>
        ))}
        {["4", "5", "6", "*"].map((btn) => (
          <Grid item xs={3} key={btn}>
            <Button fullWidth variant="contained" onClick={() => handleButtonClick(btn)}>
              {btn}
            </Button>
          </Grid>
        ))}
        {["1", "2", "3", "-"].map((btn) => (
          <Grid item xs={3} key={btn}>
            <Button fullWidth variant="contained" onClick={() => handleButtonClick(btn)}>
              {btn}
            </Button>
          </Grid>
        ))}
        {["0", "C", "=", "+"].map((btn) => (
          <Grid item xs={3} key={btn}>
            <Button fullWidth variant="contained" onClick={() => handleButtonClick(btn)}>
              {btn}
            </Button>
          </Grid>
        ))}
      </Grid>

      <Dialog open={showPopup}>
        <DialogTitle>Are you still there?</DialogTitle>
        <DialogContent>
          <center><Button onClick={handleYesClick}>Yes</Button></center>
        </DialogContent>
      </Dialog>

      <Dialog open={captchaStage > 0 && captchaStage < 51}>
        <DialogTitle>
          {`Enter ALL the digits of π!`}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="3.1415.."
            onChange={() => { }}
          />
          <Box height={20} />
          <center><Button onClick={handleCaptchaClick}>Ok</Button></center>
          <DialogContent style={{ color: 'gray', fontSize: '10px' }}>I wonder what happens if I click 'OK' <b>(3!/2!) + cos(0) x 49</b> times 🤔</DialogContent>
        </DialogContent>
      </Dialog>

      <Dialog open={captchaStage === 51}>
        <DialogTitle>woah! smarty</DialogTitle>
        <DialogContent>
          <Button onClick={handleOkClick}>OK</Button>
        </DialogContent>
      </Dialog>

      <Dialog open={showSlider}>
        <DialogTitle>Slide to reveal answer 😏</DialogTitle>
        <DialogContent>
          <Slider value={sliderValue} max={100} onChange={handleSliderChange} />
        </DialogContent>
      </Dialog>
      <Box
        display="flex"
        justifyContent="space-between"
        width="100%"
        bottom={10}
        px={0}
        color="gray"
        fontSize="12px"
        style={{marginTop: '15px'}}
      >
        <Typography variant="caption">Made in <b>Scrapyard Patna</b></Typography>
        <Typography variant="caption">Sponsored by <b>Hetzenr</b></Typography>
      </Box>
    </Container>
  );
};

export default App;
