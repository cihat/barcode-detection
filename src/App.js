import React, { useRef, useState, useEffect } from "react"

function App() {
  const video = useRef(null)
  const canvas = useRef(null)
  const [barcode, setBarcode] = useState(null)

  function openCam() {
    navigator.mediaDevices
      .getUserMedia({ video: { width: 1280, height: 720 } })
      .then((stream) => {
        video.current.srcObject = stream
        video.current.play()

        const ctx = canvas.current.getContext("2d")

        const barcode = new window.BarcodeDetector({
          formats: ["qr_code", "ean_13"],
        })

        setInterval(() => {
          canvas.current.width = video.current.videoWidth
          canvas.current.height = video.current.videoHeight
          ctx.drawImage(
            video.current,
            0,
            0,
            video.current.videoWidth,
            video.current.videoHeight
          )

          barcode
            .detect(canvas.current)
            .then(([data]) => {
              if (data) {
                setBarcode(data.rawValue)
              } else {
                // console.log("No barcode detected")
              }
            }, 1000)
            .catch((err) => {
              console.error(`Oh no!`, err)
            })
        })
      })
      .catch((err) => console.log(err))
  }

  useEffect(() => {
    // if (barcode) {
    //   console.log(barcode)
    // }
  }, [barcode])

  return (
    <>
      <button onClick={() => openCam()}>Open Camera</button>
      <div>
        <video ref={video} autoPlay muted hidden />
        <canvas ref={canvas} />
        {barcode && <div>Finded Barcode: {barcode.code}</div>}
      </div>
    </>
  )
}

export default App
