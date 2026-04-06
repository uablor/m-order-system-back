"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
class BaseRepository {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    getRepo(manager) {
        return manager
            ? manager.getRepository(this.repository.target)
            : this.repository;
    }
    async create(data, manager) {
        const repo = manager ? manager.getRepository(this.repository.target) : this.repository;
        const entity = repo.create(data);
        return repo.save(entity);
    }
    async update(id, data, manager) {
        const repo = manager ? manager.getRepository(this.repository.target) : this.repository;
        const criteria = { [this.getPrimaryColumn()]: id };
        await repo.update(criteria, data);
        return repo.findOne({ where: criteria });
    }
    async delete(id, manager) {
        const repo = manager ? manager.getRepository(this.repository.target) : this.repository;
        const criteria = { [this.getPrimaryColumn()]: id };
        const result = await repo.delete(criteria);
        return (result.affected ?? 0) > 0;
    }
    async findOneById(id, manager, options) {
        const repo = manager ? manager.getRepository(this.repository.target) : this.repository;
        return repo.findOne({ where: { [this.getPrimaryColumn()]: id }, ...options });
    }
    async findOneBy(where, manager, options) {
        const repo = manager ? manager.getRepository(this.repository.target) : this.repository;
        return repo.findOne({ where, ...options });
    }
    getPrimaryColumn() {
        return 'id';
    }
}
exports.BaseRepository = BaseRepository;
//# sourceMappingURL=base.repository.js.map