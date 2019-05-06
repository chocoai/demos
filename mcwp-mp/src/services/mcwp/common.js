import request from './'

export const getSSQ = (param) => request.get('/comm/sys/dict/items', param)
