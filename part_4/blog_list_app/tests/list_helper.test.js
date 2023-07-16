import list_helper from "../utils/list_helper.js";

test('dummy returns one', () => {
    const blogs = []
    const result = list_helper.dummy(blogs)
    expect(result).toBe(1)
})
