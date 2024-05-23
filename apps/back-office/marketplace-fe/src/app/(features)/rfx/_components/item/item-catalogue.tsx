import {
  Badge,
  Box,
  Button,
  Card,
  Checkbox,
  Flex,
  Group,
  Image,
  LoadingOverlay,
  Modal,
  NumberInput,
  Pagination,
  Paper,
  Radio,
  Stack,
  Text,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { logger } from '@megp/core-fe';
import { useParams, useRouter } from 'next/navigation';
import { useLazyListQuery } from '../../_api/product-catalogue/product-catalogue.api';
import CatalogForm from './item-catalogue-form.component';
import {
  useCreateMutation,
  useListByIdQuery,
  useUpdateMutation,
} from '../../_api/rfx/technical-requirement.api';
import { notifications } from '@mantine/notifications';
import { useDisclosure } from '@mantine/hooks';
import {
  useCancelInvitationMutation,
  useInviteSelectedMutation,
  useMakeOpenInvitationMutation,
} from '@/store/api/rfx/rfx.api';
import { useLazyReadQuery } from '../../_api/rfx/items.api';
import Invitation from '../invitation/invitation.component';
import { IconArrowBack, IconBan, IconTrash } from '@tabler/icons-react';
import {
  useLazyGetItemTemplateQuery,
  useLazyGetProductCataloguesQuery,
} from '@/store/api/rfx/item.api';

function calculateTotalPages(totalItems: number, itemsPerPage: number): number {
  if (totalItems <= 0 || itemsPerPage <= 0) {
    return 0;
  }
  return Math.ceil(totalItems / itemsPerPage);
}

const perPage = 10;

export default function ItemCatalogue() {
  const [
    getCatalogueItems,
    { data: catalogueItems, isLoading: isGettingCatalogue },
  ] = useLazyGetProductCataloguesQuery();

  const router = useRouter();
  const { id } = useParams();

  const [page, setPage] = useState(1);
  const totalPages = calculateTotalPages(catalogueItems?.count ?? 0, perPage);
  const { itemId } = useParams();
  const [opened, { open, close }] = useDisclosure(false);
  const [noOfSuppliers, setNoOfSuppliers] = useState<string | number>();
  const [invitationMode, setInvitationMode] = useState('selected');
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([]);
  const [filterConditions, setFilterConditions] = useState<any[]>([]);
  const [randomNoError, setRandomNoError] = useState(false);

  const { data: technicalRequirments, isLoading: isGettingTechnicalReqts } =
    useListByIdQuery({ id: itemId.toString(), collectionQuery: {} });
  const [saveReqts, { isLoading: isSavingReqts }] = useCreateMutation();
  const [updateReqts, { isLoading: isUpdatingReqts }] = useUpdateMutation();
  const [
    invitedSelected,
    { isLoading: isInviting, isSuccess: isInvitationSuccess },
  ] = useInviteSelectedMutation();
  const [getItem, { data: selected, isLoading: isGettingItemDetail }] =
    useLazyReadQuery();
  const [
    cancelinvitation,
    { isLoading: isCancellingInvitation, isSuccess: isCancelSuccess },
  ] = useCancelInvitationMutation();
  const [
    makeOpenInvitation,
    { isLoading: isMakingOpen, isSuccess: isMadeOpen },
  ] = useMakeOpenInvitationMutation();

  useEffect(() => {
    getItem(itemId.toString());
  }, [isInvitationSuccess, isCancelSuccess, isMadeOpen, itemId]);

  useEffect(() => {
    const from = (page - 1) * perPage;
    const where = Object.entries(
      technicalRequirments?.items?.[0]?.technicalSpecification || {},
    )
      .map(([key, value]) => {
        let val = value;
        if (typeof value === 'string' && value?.includes(',')) {
          val = `${value}`;
        }
        return [
          [
            {
              column:
                key == 'quantity'
                  ? `quantity`
                  : `specifications->>${key.replace(/\s/g, '')}`,
              operator: typeof value === 'number' ? '>=' : '=',
              value: val ?? '',
            },
          ],
        ];
      })
      .flat();
    setFilterConditions(where);
    logger.log(where);
    logger.log(filterConditions);

    getCatalogueItems({
      skip: from,
      take: perPage,
      orderBy: [
        {
          column: 'createdAt',
          direction: 'DESC',
        },
      ],
      // where: [
      //   [
      //     {
      //       column: 'specifications->>ram',
      //       operator: '=',
      //       value: 500,
      //     },
      //   ],
      //   [
      //     {
      //       column: 'specifications->>size',
      //       operator: '=',
      //       value: '40',
      //     },
      //   ],
      //   [
      //     {
      //       column: 'specifications->>model',
      //       operator: '=',
      //       value: 'X123',
      //     },
      //   ],
      //   // [
      //   //   {
      //   //     column: 'specifications->>quantity',
      //   //     operator: '=',
      //   //     value: 62,
      //   //   },
      //   // ],
      //   // [
      //   //   {
      //   //     column: 'specifications->>5gnetwork',
      //   //     operator: '=',
      //   //     value: false,
      //   //   },
      //   // ],
      //   [
      //     {
      //       column: 'specifications->>processor',
      //       operator: '=',
      //       value: 'Intel Core i7-10700',
      //     },
      //   ],
      //   [
      //     {
      //       column: 'specifications->>memorysize',
      //       operator: '=',
      //       value: 16,
      //     },
      //   ],
      //   [
      //     {
      //       column: 'specifications->>batterylife',
      //       operator: '=',
      //       value: '12',
      //     },
      //   ],
      //   [
      //     {
      //       column: 'specifications->>processormodel',
      //       operator: '=',
      //       value: 'Core i7-11800H',
      //     },
      //   ],
      //   [
      //     {
      //       column: 'specifications->>operatingsystem',
      //       operator: '=',
      //       value: 'Windows 10',
      //     },
      //   ],
      // ],
      where: where,
    });
  }, [technicalRequirments, isCancelSuccess]);

  const onSave = async (data: any) => {
    try {
      if (technicalRequirments?.items?.[0]?.technicalSpecification) {
        await updateReqts({
          rfxItemId: itemId.toString(),
          id: technicalRequirments?.items?.[0]?.id,
          technicalSpecification: data,
          deliverySpecification: {},
        }).unwrap();
      } else
        await saveReqts({
          rfxItemId: itemId.toString(),
          technicalSpecification: data,
          deliverySpecification: {},
        }).unwrap();
      notifications.show({
        title: 'Success',
        message: 'Saved specifications successfully',
        color: 'green',
      });
    } catch (err: any) {
      notifications.show({
        title: 'Error',
        message: err.data.message,
        color: 'red',
      });
    }
  };

  function selectRandomElements(array, n) {
    const shuffled = array.slice().sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
  }

  const inviteSuppliers = async () => {
    try {
      if (invitationMode == 'selected')
        await invitedSelected({
          productCatalogueIds: selectedSuppliers,
          id: itemId.toString(),
        }).unwrap();
      else if (invitationMode == 'all') {
        const res = await getCatalogueItems({
          where: [],
          select: ['id'],
        });
        await invitedSelected({
          productCatalogueIds: res?.data?.items?.map((item) => item.id),
          id: itemId.toString(),
        });
      } else if (invitationMode == 'random') {
        const res = await getCatalogueItems({
          where: [],
          select: ['id'],
        });
        const ids = selectRandomElements(
          res?.data?.items?.map((item) => item.id),
          noOfSuppliers,
        );
        await invitedSelected({
          productCatalogueIds: ids,
          id: itemId.toString(),
        });
      } else if (invitationMode == 'open') {
        await makeOpenInvitation({ id: itemId.toString() }).unwrap();
      }
      notifications.show({
        title: 'Success',
        message: 'Added suppliers to invitation successfully',
        color: 'green',
      });
    } catch (err: any) {
      notifications.show({
        title: 'Error',
        message: err.data.message,
        color: 'red',
      });
    }
  };

  const removeInvitations = async () => {
    try {
      await cancelinvitation({ id: itemId.toString() }).unwrap();
      notifications.show({
        title: 'Success',
        message:
          'Invitation removed successfully. You can now add new products to the invitation',
        color: 'green',
      });
    } catch (err: any) {
      notifications.show({
        title: 'Error',
        message: err.data.message,
        color: 'red',
      });
    }
  };

  useEffect(() => {
    if (selectedSuppliers?.length > 0) {
      setInvitationMode('selected');
    } else setInvitationMode('');
  }, [selectedSuppliers]);

  return (
    <Flex className="gap-2">
      <Modal opened={opened} onClose={close} title="Invitation Configuration">
        <Stack>
          <NumberInput
            label="No of suppliers to invite"
            placeholder="Enter no of suppliers you wish to invite"
            value={noOfSuppliers}
            onChange={(value) => {
              setNoOfSuppliers(value);
              setRandomNoError(false);
            }}
            error={randomNoError ? 'Please enter number of suppliers' : null}
          />
          <Button
            className="ml-auto"
            onClick={async () => {
              if (!noOfSuppliers) {
                setRandomNoError(true);
                return;
              }
              await inviteSuppliers();
              close();
            }}
            loading={isInviting || isGettingCatalogue}
          >
            Invite
          </Button>
        </Stack>
      </Modal>
      <Stack className="w-1/4">
        <CatalogForm
          loading={isSavingReqts || isUpdatingReqts}
          onSave={onSave}
          data={technicalRequirments?.items?.[0]?.technicalSpecification}
          disabled={selected?.status == 'INVITATION_PREPARED'}
          itemCode={selected?.itemCode}
        />
      </Stack>
      {!technicalRequirments?.items?.[0]?.technicalSpecification && (
        <Box className="min-h-full flex items-center justify-center mx-auto">
          No specification provided. Please set specification and search to get
          products.
        </Box>
      )}
      {technicalRequirments?.items?.[0]?.technicalSpecification &&
        catalogueItems?.items?.length == 0 && (
          <Box className="min-h-full flex items-center justify-center mx-auto">
            No product found for the given specifications.
          </Box>
        )}
      {selected?.isOpen && (
        <Stack className="min-h-full flex items-center justify-center mx-auto">
          <Button
            className="bg-red-500"
            leftSection={<IconTrash stroke="sm" />}
            onClick={removeInvitations}
            loading={isCancellingInvitation}
          >
            Remove Invitations
          </Button>
          <Box>
            An open invitation has been selected for this item. All suppliers
            are invited to participate.
          </Box>
        </Stack>
      )}
      {selected?.status == 'INVITATION_PREPARED' && !selected?.isOpen && (
        <Stack className="w-3/4 h-fit p-2">
          <Flex justify={'space-between'} className="items-center">
            <p>Prepared Invitations</p>
            <Flex className="gap-4">
              <Button
                variant="outline"
                onClick={() => router.push(`/rfx/${id}/items`)}
                leftSection={<IconArrowBack />}
              >
                Back to items
              </Button>
              <Button
                className="bg-red-500"
                leftSection={<IconTrash stroke="sm" />}
                onClick={removeInvitations}
                loading={isCancellingInvitation}
              >
                Remove from invitation
              </Button>
            </Flex>
          </Flex>
          <Invitation itemId={itemId.toString()} />
        </Stack>
      )}
      {technicalRequirments?.items?.[0]?.technicalSpecification &&
        !selected?.isOpen &&
        selected?.status !== 'INVITATION_PREPARED' &&
        catalogueItems?.items?.length != 0 && (
          <Flex className="gap-4 w-3/4">
            <Paper className="p-4">
              <Stack>
                <LoadingOverlay
                  visible={
                    isGettingCatalogue ||
                    isGettingTechnicalReqts ||
                    isGettingItemDetail
                  }
                />
                <Group className="ml-auto">
                  <Radio.Group
                    value={invitationMode}
                    onChange={setInvitationMode}
                  >
                    <Flex className="gap-4">
                      <Radio value="selected" label="Invite Selected" />
                      <Radio value="random" label="Random" />
                      <Radio value="all" label="All" />
                    </Flex>
                  </Radio.Group>
                  <Button
                    disabled={
                      !invitationMode ||
                      (invitationMode == 'selected' &&
                        selectedSuppliers?.length == 0)
                    }
                    onClick={async () => {
                      invitationMode == 'random'
                        ? open()
                        : await inviteSuppliers();
                    }}
                    loading={isInviting || isMakingOpen}
                  >
                    Add to invitation
                  </Button>
                </Group>
                <Flex wrap={'wrap'} className="gap-4">
                  {catalogueItems?.items?.map((item) => (
                    <Card
                      shadow="sm"
                      padding="lg"
                      radius="md"
                      withBorder
                      key={item.id}
                      className={`w-1/3 flex-grow-0 ${selectedSuppliers.includes(item?.id) && ' border-primary-200 border-2 '}`}
                      style={{ width: `calc(33.33% - 1rem)` }}
                      // h={200}
                    >
                      <Card.Section>
                        <Image
                          src={item?.presignedUrl}
                          className="h-48"
                          fit="cover"
                          alt="Image Url"
                        />
                      </Card.Section>
                      <Group justify="space-between" mt="md" mb="xs">
                        {invitationMode == 'selected' && (
                          <Checkbox
                            checked={selectedSuppliers.includes(item?.id)}
                            onChange={(event) => {
                              setSelectedSuppliers(
                                event.currentTarget.checked
                                  ? [...selectedSuppliers, item?.id]
                                  : selectedSuppliers.filter(
                                      (id) => id !== item?.id,
                                    ),
                              );
                            }}
                          />
                        )}
                        <Text fw={500}>{item?.description}</Text>
                        <Badge color="pink">On Sale</Badge>
                      </Group>
                      <Box className="h-fit mb-3">
                        <Text size="sm" c="dimmed" lineClamp={4}>
                          {Object.entries(item?.specifications || {})
                            .filter(([key]) => key !== 'url')
                            .map(
                              ([key, value]) =>
                                `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value} `,
                            )
                            .join(', ')}
                        </Text>
                      </Box>
                    </Card>
                  ))}
                </Flex>
                <Pagination
                  className="ml-auto"
                  onChange={setPage}
                  size="sm"
                  total={totalPages}
                  value={page}
                  withEdges
                />
              </Stack>
            </Paper>
          </Flex>
        )}
    </Flex>
  );
}
