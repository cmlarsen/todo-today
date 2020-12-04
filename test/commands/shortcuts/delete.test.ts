import {expect, test} from '@oclif/test'

describe('shortcuts:delete', () => {
  test
  .stdout()
  .command(['shortcuts:delete'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['shortcuts:delete', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
