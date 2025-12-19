// ต้องติดตั้ง bcryptjs และ sequelize ก่อน: npm install sequelize bcryptjs pg pg-hstore
import { DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';

let User;

// ฟังก์ชันสำหรับกำหนด Model และส่ง Instance ของ Sequelize เข้ามา
export const initUserModel = (sequelize) => {
    User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        tableName: 'users', // ตั้งชื่อตารางใน PostgreSQL
        timestamps: true,
        // Hooks สำหรับ Hash Password ก่อนบันทึก
        hooks: {
            beforeCreate: async (user) => {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            },
            beforeUpdate: async (user) => {
                if (user.changed('password')) {
                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(user.password, salt);
                }
            }
        }
    });
    return User;
};

// ฟังก์ชันสำหรับดึง Model User กลับมา (ใช้ในที่อื่นๆ)
export const getUser = () => User;

// ฟังก์ชันสำหรับสร้าง Admin User (เรียกใช้ใน server.js)
export const createAdminUser = async () => {
    try {
        const adminUsername = process.env.ADMIN_USERNAME;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminUsername || !adminPassword) {
            console.log('🟠 ADMIN_USERNAME or ADMIN_PASSWORD not set. Skipping admin creation.');
            return;
        }
        if (!User) {
            console.error('createAdminUser: User model not initialized');
            return;
        }

        const existingAdmin = await User.findOne({ where: { username: adminUsername } });

        if (!existingAdmin) {
            const isAlreadyHashed = typeof adminPassword === 'string' && adminPassword.startsWith('$2') && adminPassword.length >= 50;
            if (isAlreadyHashed) {
                // เก็บค่า hash ตรงๆ โดยข้าม hooks (เพื่อไม่ให้ hash ซ้ำ)
                await User.create({ username: adminUsername, password: adminPassword }, { hooks: false });
            } else {
                // ให้ hook ก่อนCreate ทำการ hash ให้
                await User.create({ username: adminUsername, password: adminPassword });
            }
            console.log('✅ Admin user created');
        } else {
            console.log('ℹ️ Admin user already exists');
        }
    } catch (error) {
        console.error('❌ Error creating admin user:', error);
    }
};

export default User;