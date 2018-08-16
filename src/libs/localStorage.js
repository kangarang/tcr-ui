import localforage from 'localforage'

export const loadState = () => {
  try {
    const serializedState = localStorage.getItem('state')
    if (serializedState === null) {
      return undefined
    }
    return JSON.parse(serializedState)
  } catch (err) {
    return undefined
  }
}

export const saveState = state => {
  try {
    const serializedState = JSON.stringify(state)
    localStorage.setItem('state', serializedState)
  } catch (err) {
    // Ignore write errors.
  }
}

export async function saveLocalForage(key, value) {
  try {
    console.log(`storing ${key.slice(8)} in indexedDB..`)
    return localforage.setItem(key, value)
  } catch (err) {
    console.log('local storage save err:', err)
  }
}

export async function getLocalForage(key) {
  try {
    return localforage.getItem(key)
  } catch (err) {
    console.log('local storage get err:', err)
  }
}

export async function removeLocalForage(key) {
  try {
    return localforage.removeItem(key)
  } catch (err) {
    console.log('local storage remove err:', err)
  }
}
