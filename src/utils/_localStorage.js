import localforage from 'localforage'

export async function saveLocal(key, value) {
  try {
    console.log(`storing ${key.slice(8)} in indexedDB..`)
    return localforage.setItem(key, value)
  } catch (err) {
    console.log('local storage save err:', err)
  }
}

export async function getLocal(key) {
  try {
    return localforage.getItem(key)
  } catch (err) {
    console.log('local storage get err:', err)
  }
}
