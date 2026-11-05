import { describe, expect, it } from 'vitest'
import { touchLessonKey, touchWords } from '../src/ui/touchwords.ts'

describe('a touch screen says the touch controls, not keys and clicks', () => {
  it('names the hand, the panels and the stick in place of their keys', () => {
    expect(touchWords('Shut the door before dark: {key:hands}.')).toBe('Shut the door before dark: Interact.')
    expect(touchWords('{key:craft} opens crafting.')).toBe('☰ Craft opens crafting.')
    expect(touchWords('{key:move} move')).toBe('the stick move')
  })

  it('leaves an action it has no word for to the keys', () => {
    expect(touchWords('{key:sneak} to sneak')).toBe('{key:sneak} to sneak')
  })

  it('says clicks as taps and long presses, keeping the case and the ending', () => {
    expect(touchWords('Hold the torch and left click the fire.')).toBe('Hold the torch and tap the fire.')
    expect(touchWords('Left click it until it falls over.')).toBe('Tap it until it falls over.')
    expect(touchWords('hold the seed, right click the farmland')).toBe('hold the seed, long-press the farmland')
    expect(touchWords('right-clicked twice')).toBe('long-pressed twice')
    expect(touchWords('LMB place · RMB exit')).toBe('tap place · long-press exit')
    expect(touchWords('click it and then a slot')).toBe('tap it and then a slot')
  })

  it("draws a lesson's key badge as the touch control", () => {
    expect(touchLessonKey('LMB')).toBe('Tap')
    expect(touchLessonKey('E')).toBe('Interact')
    expect(touchLessonKey('hold E')).toBe('Hold Interact')
    expect(touchLessonKey('C')).toBe('☰ Craft')
    expect(touchLessonKey('WASD')).toBe('Stick')
  })
})
