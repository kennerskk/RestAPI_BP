import { DataTypes } from 'sequelize';

// 👉 ประกาศตัวแปร Stat และ export แบบ Named (เพื่อให้ค่าอัปเดตได้หลังจาก init)
// ตัวแปรนี้จะเป็น undefined ในตอนแรก จนกว่า initStatModel จะถูกเรียกใช้ใน server.js
export let Stat; 

/**
 * ฟังก์ชันสำหรับกำหนด Model และเชื่อมต่อกับ Sequelize Instance
 * @param {Sequelize} sequelize - อินสแตนซ์ของ Sequelize ที่เชื่อมต่อกับ Database แล้ว
 */
export const initStatModel = (sequelize) => {
    // กำหนดโครงสร้างตาราง (Schema) และผูกค่าเข้ากับตัวแปร Stat
    Stat = sequelize.define('Stat', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        // data: ใช้ประเภท JSONB ของ PostgreSQL
        // ข้อดี: เก็บข้อมูล JSON โครงสร้างไหนก็ได้ (เหมือน MongoDB)
        // เหมาะมากสำหรับ Dashboard ที่ข้อมูลอาจมีการเปลี่ยนแปลงโครงสร้างบ่อย
        data: {
            type: DataTypes.JSONB, 
            allowNull: true,
        },
    }, {
        tableName: 'stats', // ชื่อตารางใน Database
        timestamps: true,   // สร้าง field createdAt และ updatedAt ให้อัตโนมัติ
    });
    
    return Stat;
};
