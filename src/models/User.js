const db = require('../config/database');
const bcrypt = require('bcrypt');

class User {
    static async findAll() {
        return await db.query('SELECT id, name, email, created_at FROM users');
    }

    static async findById(id) {
        return await db.get(
            'SELECT id, name, email, created_at FROM users WHERE id = ?',
            [id]
        );
    }

    static async findByEmail(email) {
        return await db.get(
            'SELECT id, name, email, password FROM users WHERE email = ?',
            [email]
        );
    }

    static async findByName(name) {
        return await db.query(
            'SELECT id, name, email, created_at FROM users WHERE name LIKE ?',
            [`%${name}%`]
        );
    }

    static async create(userData) {
        const { name, email, password } = userData;
        
        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const result = await db.run(
            'INSERT INTO users (name, email, password, created_at) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, new Date().toISOString()]
        );

        return {
            id: result.lastID,
            name,
            email
        };
    }

    static async update(id, updateData) {
        const { name, email } = updateData;
        
        // Build update query dynamically
        const updates = [];
        const params = [];
        
        if (name) {
            updates.push('name = ?');
            params.push(name);
        }
        if (email) {
            updates.push('email = ?');
            params.push(email);
        }
        
        if (updates.length === 0) {
            throw new Error('No fields to update');
        }
        
        params.push(id);
        const query = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
        
        return await db.run(query, params);
    }

    static async delete(id) {
        return await db.run('DELETE FROM users WHERE id = ?', [id]);
    }

    static async emailExists(email, excludeId = null) {
        let query = 'SELECT id FROM users WHERE email = ?';
        let params = [email];
        
        if (excludeId) {
            query += ' AND id != ?';
            params.push(excludeId);
        }
        
        const user = await db.get(query, params);
        return !!user;
    }

    static async authenticate(email, password) {
        const user = await this.findByEmail(email);
        
        if (!user) {
            return null;
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        
        if (passwordMatch) {
            return {
                id: user.id,
                name: user.name,
                email: user.email
            };
        }
        
        return null;
    }
}

module.exports = User; 