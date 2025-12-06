// ต้องติดตั้ง sequelize ก่อน
import { DataTypes } from 'sequelize';

let Stat;

// ฟังก์ชันสำหรับกำหนด Model และส่ง Instance ของ Sequelize เข้ามา
export const initStatModel = (sequelize) => {
    Stat = sequelize.define('Stat', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        // ใช้ JSONB ใน PostgreSQL เพื่อเก็บข้อมูลแบบ NoSQL-like (flexible schema)
        data: {
            type: DataTypes.JSONB, 
            allowNull: true,
        },
        // คุณอาจจะต้องเพิ่ม fields อื่น ๆ ที่คุณต้องการใช้เป็น Index/Query หลัก
    }, {
        tableName: 'stats', // ชื่อตาราง
        timestamps: true,
        // ถ้าคุณต้องการให้ข้อมูลที่บันทึกเข้าไปตรง ๆ โดยไม่ต้องมี field 'data'
        // คุณอาจจะต้องปรับ logic ใน Controller ให้ใช้ Stat.create({ data: { ... } }) แทน
    });
    return Stat;
};

export default Stat;