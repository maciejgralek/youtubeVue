import { shallowMount } from '@vue/test-utils'
import Youtube from '@/components/Youtube.vue'

describe('Youtube.vue', () => {
  it('renders props.msg when passed', () => {
    const msg = 'new message'
    const wrapper = shallowMount(Youtube, {
    })
    console.log(wrapper.text())
    // expect(wrapper.text()).toMatch(msg)
  })
})
