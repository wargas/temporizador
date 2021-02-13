
import { ObjectId } from 'mongodb';
import connect from '../../utils/database';


export default async (req, res) => {

    const { db } = await connect();
    const { tempo, _id = null } = req.body;

    if (req.method === 'POST') {
        const insert = await db.collection('registros')
            .insertOne({ tempo, date: new Date() });

        res.send(insert.ops[0])
    }
    if (req.method === 'PUT') {
        const update = await db.collection('registros')
            .updateOne({ _id: ObjectId(_id) }, { $set: { tempo } })



        res.send('ok')
    }

    const data = await db.collection('registros').aggregate([
        {
            $group: {
                _id: {
                    $dateToString: {
                        date: "$date",
                        format: "%Y-%m-%d"
                    }
                },
                total: {
                    $sum: "$tempo"
                }
            }
        },
        {
            $sort: {
                _id: -1
            }
        }
    ]).toArray()

    res.send(data)

}