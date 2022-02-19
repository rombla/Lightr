import React, { useEffect } from "react";
import server from "../utils/socket";
import { RgbColor, RgbColorPicker } from "react-colorful";

const defaultColorValue = 0;

const ColorPicker: React.FC = () => {
  const [color, setColor] = React.useState<RgbColor>({
    r: defaultColorValue,
    g: defaultColorValue,
    b: defaultColorValue,
  });

  const [socketStatus, setSocketStatus] = React.useState("CHECKING...");

  useEffect(() => {
    server.connect();

    setTimeout(() => {
      setSocketStatus(server.getSocketStatus());
      const initialState = server.getInitialState();
      initialState && setColor(initialState);
    }, 500);

    return () => {
      server.disconnect();
    };
  }, []);

  const handleChange = (newColor: RgbColor): void => {
    setColor(newColor);
    server.sendToSocket(newColor);
  };

  return (
    <div style={styles.container}>
      <RgbColorPicker color={color} onChange={handleChange} />
      <div style={styles.defaultColors}>
        <div style={styles.defaultColorsRow}>
          <ColorBox r={255} g={0} b={0} onPress={handleChange} />
          <ColorBox r={0} g={255} b={0} onPress={handleChange} />
          <ColorBox r={0} g={0} b={255} onPress={handleChange} />
        </div>
        <div style={styles.defaultColorsRow}>
          <ColorBox r={255} g={255} b={0} onPress={handleChange} />
          <ColorBox r={0} g={255} b={255} onPress={handleChange} />
          <ColorBox r={255} g={0} b={255} onPress={handleChange} />
        </div>
      </div>
      <div style={styles.defaultColorsRow}>
        <ColorBox r={0} g={0} b={0} onPress={handleChange} />
        <ColorBox r={255} g={255} b={255} onPress={handleChange} />
      </div>
      <div style={{ position: "absolute", bottom: 10 }}>
        <span style={{ color: "grey" }}>
          connection status : {socketStatus}
        </span>
      </div>
    </div>
  );
};

interface ColorBoxProps extends RgbColor {
  onPress: (input: RgbColor) => void;
}

const ColorBox: React.FC<ColorBoxProps> = ({ r, g, b, onPress }) => {
  const handlePress = (): void => {
    onPress({ r, g, b });
  };

  return (
    <button
      onClick={handlePress}
      style={{
        ...styles.defaultColor,
        backgroundColor: `rgb(${r}, ${g}, ${b})`,
      }}
    ></button>
  );
};

interface StyleObject {
  [name: string]: React.CSSProperties;
}

const styles: StyleObject = {
  container: {
    maxWidth: 420,
    margin: "auto",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  preview: {
    marginBottom: 20,
    borderRadius: 5,
    width: 50,
    height: 50,
  },
  defaultColors: {
    display: "flex",
    flexDirection: "column",
    alignItems: "baseline",
    paddingLeft: 50,
    paddingRight: 50,
    marginTop: 50,
  },
  defaultColorsRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 10,
    marginBottom: 10,
  },
  defaultColor: {
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 5,
    border: "1px solid grey",
    width: 50,
    height: 50,
  },
  blue: {
    backgroundColor: "blue",
  },
  red: {
    backgroundColor: "red",
  },
  green: {
    backgroundColor: "green",
  },
};

export default ColorPicker;
