// @odoo-module

import { SampleServer } from "@web/model/sample_server";

let rpcId = 0;
export async function rpc(route, params = {}) {
    const response = await fetch(route, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id: rpcId++,
            jsonrpc: "2.0",
            method: "call",
            params,
        }),
    });
    const rpcResponse = await response.json();
    return rpcResponse.result;
}

class DataSource {
    async call() {
        return null;
    }
}

export class ServerDataSource extends DataSource {
    call(route, params = {}) {
        return rpc(route, params);
    }
}

export class SampleDataSource extends DataSource {
    constructor(modelName, fieldDefs) {
        super();
        this.source = new SampleServer(modelName, fieldDefs);
    }

    call(_, params = {}) {
        return this.source.mockRpc(params);
    }
}

export class Orm {
    static server = new Orm(new ServerDataSource());

    constructor(source) {
        this.source = source;
    }

    call(model, method, args = [], kwargs = {}) {
        return this.source.call(`/web/dataset/call_kw`, { model, method, args, kwargs });
    }

    read(model, ids, fields, kwargs = {}) {
        return this.call(model, "read", [ids, fields], kwargs);
    }

    search(model, domain, kwargs = {}) {
        return this.call(model, "search", [domain], kwargs);
    }

    searchRead(model, domain, fields, kwargs = {}) {
        return this.call(model, "search_read", [domain, fields], kwargs);
    }
}
