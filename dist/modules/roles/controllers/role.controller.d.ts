import { RoleCommandService } from '../services/role-command.service';
import { RoleQueryService } from '../services/role-query.service';
import { RoleCreateDto } from '../dto/role-create.dto';
import { RoleUpdateDto } from '../dto/role-update.dto';
import { RoleListQueryDto } from '../dto/role-list-query.dto';
import { RoleResponseDto } from '../dto/role-response.dto';
export declare class RoleController {
    protected readonly commandService: RoleCommandService;
    protected readonly queryService: RoleQueryService;
    constructor(commandService: RoleCommandService, queryService: RoleQueryService);
    adminCreate(dto: RoleCreateDto): Promise<{
        id: number;
    }>;
    adminGetById(id: number): Promise<RoleResponseDto | null>;
    adminGetList(query: RoleListQueryDto): Promise<import("../../../common/base/interfaces/response.interface").ResponseWithPaginationInterface<RoleResponseDto>>;
    adminUpdate(id: number, dto: RoleUpdateDto): Promise<void>;
    adminDelete(id: number): Promise<void>;
}
