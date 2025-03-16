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
  const [disabled, setDisabled] = useState(false); // State to disable buttons

  useEffect(() => {
    if (!triggerPrank) return;

    const interval = setInterval(() => {
      setInput((prev) => prev.slice(1) + prev[0]);
    }, 100);

    const timeout = setTimeout(() => {
      setShowPopup(true);
    }, 2 * 60 * 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [triggerPrank]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (disabled) return; // Prevent input when disabled
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
  }, [disabled]);

  const closeAllPopups = () => {
    setShowPopup(false);
    setCaptchaStage(0);
    setShowSlider(false);
  };

  const handleButtonClick = (value) => {
    if (value === "=") {
      if (input) {
        setDisabled(true); // Disable buttons
        setTriggerPrank(true);
        setInput("Generating Answer... Don't give up on your dreams! Talking with wizards! This MIGHT take a while. I AM MUSIC. Hold tight, just there! hmm. Activating my last braincells... ");
      }
    } else if (value === "C") {
      setInput("");
      setTriggerPrank(false);
      setDisabled(false); // Enable buttons
      closeAllPopups();
    } else {
      if (input === "" && ["+", "-", "*", "/"].includes(value)) return;
      if (["+", "-", "*", "/"].includes(value) && ["+", "-", "*", "/"].includes(input.slice(-1))) return;
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
            <Button fullWidth variant="contained" onClick={() => handleButtonClick(btn)} disabled={disabled}>
              {btn}
            </Button>
          </Grid>
        ))}
        {["4", "5", "6", "*"].map((btn) => (
          <Grid item xs={3} key={btn}>
            <Button fullWidth variant="contained" onClick={() => handleButtonClick(btn)} disabled={disabled}>
              {btn}
            </Button>
          </Grid>
        ))}
        {["1", "2", "3", "-"].map((btn) => (
          <Grid item xs={3} key={btn}>
            <Button fullWidth variant="contained" onClick={() => handleButtonClick(btn)} disabled={disabled}>
              {btn}
            </Button>
          </Grid>
        ))}
        {["0", "C", "=", "+"].map((btn) => (
          <Grid item xs={3} key={btn}>
            <Button fullWidth variant="contained" onClick={() => handleButtonClick(btn)} disabled={disabled}>
              {btn}
            </Button>
          </Grid>
        ))}
      </Grid>

      {/* Dialogs (not affected by disabled state) */}
      <Dialog open={showPopup}>
        <DialogTitle>Are you still there?</DialogTitle>
        <DialogContent>
          <center><Button onClick={() => setCaptchaStage(1)}>Yes</Button></center>
        </DialogContent>
      </Dialog>

      <Dialog open={captchaStage > 0 && captchaStage < 51}>
        <DialogTitle>{`Enter ALL the digits of π!`}</DialogTitle>
        <DialogContent>
          <TextField fullWidth variant="outlined" placeholder="3.1415.." />
          <Box height={20} />
          <center><Button onClick={() => setCaptchaStage((prev) => prev + 1)}>Ok</Button></center>
          <DialogContent style={{ color: "gray", fontSize: "10px" }}>
            I wonder what happens if I click 'OK' <b>(3!/2!) + cos(0) x 49</b> times 🤔
          </DialogContent>
        </DialogContent>
      </Dialog>

      <Dialog open={captchaStage === 51}>
        <DialogTitle>woah! smarty</DialogTitle>
        <DialogContent>
          <Button onClick={() => setShowSlider(true)}>OK</Button>
        </DialogContent>
      </Dialog>

      <Dialog open={showSlider}>
        <DialogTitle>Slide to reveal answer 😏</DialogTitle>
        <DialogContent>
          <Slider value={sliderValue} max={100} onChange={(e, value) => setSliderValue(value)} />
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
        style={{ marginTop: "15px" }}
      >
        <Typography variant="caption">Made in <b>Scrapyard Patna</b></Typography>
        <Typography variant="caption">Sponsored by <b>Hetzenr</b></Typography>
      </Box>
    </Container>
  );
};

export default App;
