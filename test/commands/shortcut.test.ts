import {expect, test} from '@oclif/test'

describe('shortcut', () => {
  test
  .stdout()
  .command(['shortcut'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['shortcut', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
