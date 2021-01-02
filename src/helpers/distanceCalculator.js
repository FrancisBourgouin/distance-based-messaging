const IPDMEAN = 63 // in mm
const SENSORWIDTH = 17.3 // in mm (for m4/3 sensors)

const calculateFoVAngle = (focalLength) => 2 * Math.atan(SENSORWIDTH / (2 * focalLength))

const convertDegToRad = deg => deg * Math.PI / 180
const convertRadToDeg = rad => rad / Math.PI * 180

const calculateBaseSize = (imgWidth, ipd) => imgWidth / ipd * IPDMEAN

const calculateBaseAngles = fov => (180 - 90 - fov / 2)

export const calculateDistance = (focalLength, imgWidth, ipd) => {
  const fov = convertRadToDeg(calculateFoVAngle(focalLength))
  const baseAngle = convertDegToRad(calculateBaseAngles(fov))
  const baseSize = calculateBaseSize(imgWidth, ipd)

  const height = Math.tan(baseAngle) * baseSize / 2

  return height
}

console.log(convertRadToDeg(calculateFoVAngle(22)))
console.log(calculateDistance(22, 1920, 100))
console.log(calculateDistance(22, 1920, 500))
console.log(calculateDistance(22, 1920, 1000))