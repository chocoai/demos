import Xhr from './Xhr/Index';

/**
 * 封装ajax请求
 * @param {any}
 */
class ProductService {
    /**
     * 获取产品分页列表
     * @param {rowStart}
     * @param {page}
     * @param {rows}
     * @param {sort}
     * @param {order}
     * @param {startTime}
     * @param {endTime}
     * @param {code}
     * @param {prdName}
     * @param {prdType}
     * @param {prdStatus}
     * @param {repaymentKind}
     * @return {产品分页列表}
     */
    getProdPage(params, success, fail) {
        return Xhr.get('/v1/prod/page', params, success, fail);
    }
    /**
     * 删除产品
     * @param {code} 产品code
     * @return {删除}
     */
    delProduct(code, success, fail) {
        return Xhr.delete('/v1/prod/' + code, {code: code}, success, fail);
    }
    /**
     * 产品发布、停贷、启用
     * @param {code} 产品code
     * @param {pubOp} 产品发布操作:2.发布 3.停贷 4.启用,点击发布返回2~4表示第几步未完成
     * @return
     */
    prodPub(code, pubOp, success, fail) {
        return Xhr.put('/v1/prod/prodPub/' + code, {code: code, pubOp: pubOp}, success, fail);
    }

    /**
     * 发布成功后生成分享内容
     * @param {url} 产品URL地址
     * @param {code} 产品code
     * @param {width} 二维码宽
     * @param {height} 二维码高
     * @return
     */
    prodShare(params, success, fail) {
        return Xhr.get('/v1/prod/share', params, success, fail);
    }
    /**
     * 获取是否有预授信产品，已删除，预授信可以多个
     * @return
     */
    // getCreditOn(params, success, fail) {
    //     return Xhr.get('/v1/prod/creditOn', params, success, fail);
    // }
    /**
     * 获取产品列表（用于下拉）
     * @param {prdStatus} 产品状态（2：已发布）
     * @return
     */
    getDropProd(params) {
      return Xhr.promiseGet('/v1/prod/drop', params);
    }
    /**
     * 获取市民贷产品列表（用于下拉）
     * @param {prdStatus} 产品状态（2：已发布）
     * @return
     */
    getDropProdCity(params) {
      return Xhr.promiseGet('/v1/prod/drop/citizen', params);
    }
}

// 实例化再导出
export default new ProductService();
