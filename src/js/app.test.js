import foo from './app';
describe('test', () => {
	it('works', () => {
		var obj = new foo();
		console.log(foo.bar);
	})
	it('works again', () => {
		expect(true).to.be.true
	})
})