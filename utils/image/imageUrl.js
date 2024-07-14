import constant from "../../configs/constant.js"

const { IMAGE_BASE_URL } = constant

export function imageUrl(imageId) {
  return `${IMAGE_BASE_URL}/${imageId}`
}
