import { UserCommandService } from '../services/user-command.service';
import { UserQueryService } from '../services/user-query.service';
import { UserCreateDto } from '../dto/user-create.dto';
import { UserUpdateDto } from '../dto/user-update.dto';
import { ProfileUpdateDto } from '../dto/profile-update.dto';
import { UserMerchantCreateDto } from '../dto/user-merchant-create.dto';
import { UserListQueryDto } from '../dto/user-list-query.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import type { CurrentUserPayload } from '../../../common/decorators/current-user.decorator';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { AcitveDto } from 'src/common/base/dtos/active.dto';
export declare class UserController {
    protected readonly commandService: UserCommandService;
    protected readonly queryService: UserQueryService;
    constructor(commandService: UserCommandService, queryService: UserQueryService);
    adminCreate(dto: UserCreateDto): Promise<{
        id: number;
    }>;
    merchantCreate(dto: UserCreateDto, currentUser: CurrentUserPayload): Promise<{
        id: number;
    }>;
    adminCreateWithMerchant(dto: UserMerchantCreateDto): Promise<{
        userId: number;
        merchantId: number;
    }>;
    changePassword(dto: ChangePasswordDto, currentUser: CurrentUserPayload): Promise<void>;
    adminGetList(query: UserListQueryDto): Promise<import("../../../common/base/interfaces/response.interface").ResponseWithPaginationInterface<UserResponseDto>>;
    adminGetSummary(query: UserListQueryDto): Promise<{
        totalUsers: number;
        totalActive: number;
        totalInactive: number;
    }>;
    merchantGetList(query: UserListQueryDto, currentUser: CurrentUserPayload): Promise<import("../../../common/base/interfaces/response.interface").ResponseWithPaginationInterface<UserResponseDto>>;
    merchantGetSummary(query: UserListQueryDto, currentUser: CurrentUserPayload): Promise<{
        totalUsers: number;
        totalActive: number;
        totalInactive: number;
    }>;
    updateProfile(dto: ProfileUpdateDto, currentUser: CurrentUserPayload): Promise<void>;
    adminUpdate(id: number, dto: UserUpdateDto): Promise<void>;
    adminChangePassword(id: number, dto: ChangePasswordDto): Promise<void>;
    adminDelete(id: number): Promise<void>;
    adminUpdateActive(id: number, dto: AcitveDto): Promise<void>;
    getById(id: number): Promise<UserResponseDto | null>;
}
