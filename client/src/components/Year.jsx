import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

export default function Year({ monthCount, calendarObject }) {
  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];
  const cellSize = 25; // Diameter of each day circle in pixels
  const gridPadding = 40; // Vertical padding between months
  const rowPadding = 45;
  const circlePadding = 3; // Padding between circles

  // State to track the number of columns

  const svgRef = useRef(null); // Reference to the SVG element

  // Function to dynamically determine columns based on screen width
  const calculateColumns = () => {
    if (window.innerWidth > 1200) return 4;
    if (window.innerWidth > 800) return 3;
    if (window.innerWidth > 600) return 2;
    return 1;
  };

  const [numCols, setNumCols] = useState(calculateColumns());

  // Recalculate number of columns on window resize
  useEffect(() => {
    const handleResize = () => setNumCols(calculateColumns());
    window.addEventListener("resize", handleResize);

    // Cleanup listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const numRows = Math.ceil(monthCount.length / numCols); // Adjust rows based on columns
  const svgWidth = numCols * (cellSize * 7 + gridPadding); // Dynamically calculate SVG width
  const svgHeight =
    numRows * (cellSize * 6 + gridPadding + rowPadding) - rowPadding + 20; // Dynamically calculate SVG height

  // Function to save SVG as an image
  const saveAsImage = () => {
    const svgElement = svgRef.current;
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);
    const svgBlob = new Blob([svgString], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(svgBlob);

    const canvas = document.createElement("canvas");
    canvas.width = svgWidth;
    canvas.height = svgHeight;

    const context = canvas.getContext("2d");

    // Draw white background
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);

    const img = new Image();
    img.onload = () => {
      context.drawImage(img, 0, 0); // Draw the SVG image on top of the white background
      const link = document.createElement("a");
      link.download = "calendar-year.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
      URL.revokeObjectURL(url);
    };

    img.src = url;
  };

  return (
    <Container>
      <button onClick={saveAsImage} className="save-btn">
        Save as Image
      </button>
      <div className="svg-wrapper">
        <svg
          ref={svgRef}
          width={svgWidth}
          height={svgHeight}
          viewBox={`-30 -25 ${svgWidth + 20} ${svgHeight + 30}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          {monthCount.map(({ monthNames, month }, monthIndex) => {
            const row = Math.floor(monthIndex / numCols); // Determine the row of the calendar
            const col = monthIndex % numCols; // Determine the column of the calendar
            const xOffset = col * (cellSize * 7 + gridPadding); // X-offset for each month
            const yOffset = row * (cellSize * 6 + gridPadding + rowPadding); // Y-offset for each month

            return (
              <g
                key={monthIndex}
                transform={`translate(${xOffset}, ${yOffset})`}
              >
                <text
                  x={(cellSize * 7) / 2}
                  y={10}
                  textAnchor="middle"
                  className="month-title"
                >
                  {monthNames.format("MMMM")}
                </text>
                <g>
                  {daysOfWeek.map((day, idx) => (
                    <text
                      key={idx}
                      x={idx * (cellSize + circlePadding)}
                      y={30}
                      className="weekday-label"
                    >
                      {day}
                    </text>
                  ))}
                </g>
                <g transform={`translate(-10, ${20})`}>
                  {month.flat().map((day, idx) => {
                    if (!day || day.month() !== monthNames.month()) {
                      return null;
                    }

                    const dateValue = day.format("YYYY-MM-DD");
                    const color = getDayColor(dateValue, calendarObject);
                    const outlineColor = color === "#fff" ? "#E5E5E5" : "none";
                    const xPos =
                      (idx % 7) * (cellSize + circlePadding) + cellSize / 2;
                    const yPos =
                      Math.floor(idx / 7) * (cellSize + circlePadding) +
                      cellSize / 2 +
                      20;

                    return (
                      <g key={idx}>
                        <circle
                          cx={xPos}
                          cy={yPos}
                          r={cellSize / 2}
                          fill={color}
                          stroke={outlineColor}
                        />
                        <text
                          x={xPos}
                          y={yPos + 4}
                          textAnchor="middle"
                          fontSize="9px"
                          fill="#000"
                        >
                          {day.format("D")}
                        </text>
                      </g>
                    );
                  })}
                </g>
              </g>
            );
          })}
        </svg>
      </div>
    </Container>
  );
}

function getDayColor(dateValue, calendarObject) {
  const currentEntry = calendarObject.find(
    (entry) => entry.day_date === dateValue
  );
  return currentEntry ? currentEntry.label_color : "#fff"; // Default color for no data
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  button {
    margin-top: 2rem;
    font-size: 1rem;
    transition: background-color 0.2s;
  }

  .svg-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 0.5rem;
    width: 70%;
  }

  svg {
    background-color: white;
    width: 90%;
    height: auto;
  }
  .month-title {
    font-size: 1rem;
    text-align: center;
    font-weight: 600;
  }
  .weekday-label {
    font-size: 0.8rem;
    fill: #555;
  }

  @media screen and (max-width: 1200px) {
    .month-title {
      font-size: 0.9rem;
    }
    .weekday-label {
      font-size: 0.7rem;
    }
  }

  @media screen and (max-width: 800px) {
    .month-title {
      font-size: 0.8rem;
    }
    .weekday-label {
      font-size: 0.6rem;
    }
  }

  @media screen and (max-width: 600px) {
    .month-title {
      font-size: 0.7rem;
    }
    .weekday-label {
      font-size: 0.5rem;
    }
  }
`;
