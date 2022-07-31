import { BookingStatus, TableStatus } from './../../booking/booking.constant';
import { TableDetailResponseDto } from '../dto/responses/tablesRestaurant-response.dto';
import { UpdateTableDto } from '../dto/requests/update-tablesRestaurant.dto';
import { CreateTableDto } from '../dto/requests/create-tablesRestaurant.dto';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
    DEFAULT_FIRST_PAGE,
    DEFAULT_LIMIT_FOR_PAGINATION,
    DEFAULT_ORDER_BY,
    DEFAULT_ORDER_DIRECTION,
} from 'src/common/constants';
import { Brackets, EntityManager, In, Like } from 'typeorm';
import { TablesRestaurant } from '../entity/tablesRestaurant.entity';
import { TableListQueryStringDto } from '../dto/requests/list-tablesRestaurant.dto';
import { Booking } from 'src/modules/booking/entity/booking.entity';

const tableAttributes: (keyof TablesRestaurant)[] = [
    'id',
    'name',
    'status',
    'arrivalTime',
    'numberSeat',
];
@Injectable()
export class TableDiagramService {
    constructor(private readonly dbManager: EntityManager) {}

    generateQueryBuilder(queryBuilder, { keyword, arrivalTimeRange, floor }) {
        if (keyword) {
            const likeKeyword = `%${keyword}%`;
            queryBuilder.andWhere(
                new Brackets((qb) => {
                    qb.where([
                        {
                            name: Like(likeKeyword),
                        },
                        {
                            description: Like(likeKeyword),
                        },
                    ]);
                }),
            );
        }

        if (arrivalTimeRange.length === 2) {
            queryBuilder.andWhere(
                new Brackets((qb) => {
                    qb.where('arrivalTime BETWEEN :startDay AND :endDay', {
                        startDay: arrivalTimeRange[0],
                        endDay: arrivalTimeRange[1],
                    });
                }),
            );
        }

        if (floor) {
            queryBuilder.andWhere(
                new Brackets((qb) => {
                    qb.where([
                        {
                            floor,
                        },
                    ]);
                }),
            );
        }
    }

    async getTableList(query: TableListQueryStringDto) {
        try {
            const {
                page = DEFAULT_FIRST_PAGE,
                limit = DEFAULT_LIMIT_FOR_PAGINATION,
                keyword = '',
                floor = '',
                orderBy = DEFAULT_ORDER_BY,
                orderDirection = DEFAULT_ORDER_DIRECTION,
                arrivalTimeRange = [],
            } = query;

            // Pagination
            const take = +limit || DEFAULT_LIMIT_FOR_PAGINATION;
            const skip = (+page - 1) * take || 0;

            const [items, totalItems] = await this.dbManager.findAndCount(
                TablesRestaurant,
                {
                    select: tableAttributes,
                    where: (queryBuilder) =>
                        this.generateQueryBuilder(queryBuilder, {
                            keyword,
                            arrivalTimeRange,
                            floor,
                        }),
                    order: {
                        [orderBy]: orderDirection.toUpperCase(),
                    },
                    take,
                    skip,
                },
            );
            const bookings = await this.dbManager.find(Booking, {
                select: ['id', 'tableId'],
                where: {
                    status: In([
                        BookingStatus.WAITING,
                        BookingStatus.WAITING_FOR_APPROVE,
                    ]),
                },
            });

            const userListResponse = items.map((table) => {
                const bookingOfTables = bookings.filter(
                    (item) => item.tableId === table.id,
                );

                return {
                    ...table,
                    bookingCount: bookingOfTables.length,
                };
            });

            return {
                items: userListResponse,
                totalItems,
            };
        } catch (error) {
            throw error;
        }
    }

    async getTableDetail(id: number): Promise<TableDetailResponseDto> {
        try {
            const table = await this.dbManager.findOne(TablesRestaurant, {
                select: tableAttributes,
                where: { id },
            });
            return table;
        } catch (error) {
            throw error;
        }
    }

    async createTable(table: CreateTableDto): Promise<TableDetailResponseDto> {
        try {
            const insertedTable = await this.dbManager
                .getRepository(TablesRestaurant)
                .insert(table);
            const tableId = insertedTable?.identifiers[0]?.id;
            if (tableId) {
                const tableDetail = await this.getTableDetail(tableId);
                return tableDetail;
            }
            throw new InternalServerErrorException();
        } catch (error) {
            throw error;
        }
    }

    async updateTable(id: number, table: UpdateTableDto) {
        try {
            await this.dbManager
                .getRepository(TablesRestaurant)
                .update({ id }, table);
            const updatedTable = await this.getTableDetail(id);
            return updatedTable;
        } catch (error) {
            throw error;
        }
    }

    async updateStatusTableRelativeBooking(
        tableId: number,
        bookingStatus: BookingStatus,
        isExistBookingWaiting: boolean,
    ) {
        try {
            if (bookingStatus === BookingStatus.CANCELED) {
                if (isExistBookingWaiting) {
                    this.updateTable(tableId, {
                        status: TableStatus.BOOKED,
                    });
                } else {
                    this.updateTable(tableId, {
                        status: TableStatus.READY,
                    });
                }
            } else if (bookingStatus === BookingStatus.DONE) {
                this.updateTable(tableId, {
                    status: TableStatus.USED,
                });
            } else if (bookingStatus === BookingStatus.WAITING) {
                const table = await this.getTableDetail(tableId);
                if (table?.status === TableStatus.READY) {
                    this.updateTable(tableId, {
                        status: TableStatus.BOOKED,
                    });
                }
            }
        } catch (error) {
            throw error;
        }
    }

    async deleteTable(id: number, deletedBy: number) {
        try {
            await this.dbManager.update(
                TablesRestaurant,
                { id },
                {
                    deletedAt: new Date(),
                    deletedBy,
                },
            );
        } catch (error) {
            throw error;
        }
    }
}
