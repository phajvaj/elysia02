import { Elysia, t } from 'elysia';
import { ItemModel } from '../models/items';

const _modelItem = new ItemModel();

//doc swagger

const res_data = {
    200: t.Object({
        ok: t.Boolean(),
        rows: t.Array(t.Object({
            id: t.Numeric(),
            name: t.String(),
            create_date: t.String()
        }))
    }),
    404: t.Object({
        ok: t.Boolean(),
        error: t.String()
    }),
    500: t.Object({
        ok: t.Boolean(),
        error: t.String()
    })
};

export const itemsRoute = (app: Elysia) => 
    app.group('/items', (app: Elysia) => 
    app
    .get("/", () => "Hello item-type")
    .get('/type', async ({ db }) => {
        const rs = await _modelItem.getItemType(db);

        const data: any = {
            ok: true,
            rows: rs
        };

        return data;//new Response(JSON.stringify(data));
    }, {
        response: res_data,
    })
    .get('/group', async ({ db, set }) => {
        try {
            const rs:any = await _modelItem.getItemGroupALL(db);
            if(rs.length) {
                const data: any = {
                    ok: true,
                    rows: rs
                };
        
                return data;
            } else {
                set.status = 404;
                return {ok: false, error: 'data not found!'};
            }
        } catch (error) {
            set.status = 502;
            throw new Error(error?.toString);
        }
    })
    .get('/group/:typeId', async ({ db, params, set }) => {
        try {
            const id = params.typeId;
            if(!id) {
                set.status =  500;
                return {ok: false, error: 'param not valid!'};
            }
            const rs:any = await _modelItem.getItemGroup(db, id);
            if(rs.length > 0) {
                const data: any = {
                    ok: true,
                    rows: rs
                };
        
                return data;
            } else {
                set.status = 404;
                return {ok: false, error: 'data not found!'};
            }
        } catch (error) {
            set.status = 502;
            throw new Error(error?.toString);
        }
    })
);