const regex = /^([a-z0-9_.-]+)@([\da-z.-]+)\.([a-z.]{2,6})$/g

export default function emailRegex() {
  return new RegExp(regex)
}
