import styled from 'styled-components'

export const BigContainer = styled.div`
  display: grid;
  grid-gap: 15px;
  grid-template-columns: 1fr;
  width: 100%;
  padding: 0 1em 1em;
`
export const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 5px;
  border: 3px solid #${props => props.bgColor && props.bgColor.slice(-6)};
  border-radius: 4px;
`
export const Item = styled.div`
  padding: 0.7em;
  display: flex;
  flex-flow: row wrap;
  /* justify-content: center;
  align-items: flex-start; */
  justify-content: flex-start;
  align-items: center;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const Wrapper = styled.div`
  padding: 1em;
`
export const ModalMessage = styled.div`
  padding: 0 2em 2em;
`

export const Methods = styled.div`
  display: flex;
  flex-flow: column wrap;
  overflow: hidden;

  & > div {
    margin: 0.5em;
    display: block;
    overflow: hidden;

    & > div {
      /* min-width: 30%; */
    }
  }
`
