import { useState } from "react";

import {
    Card,
    Group,
    Text,
    Badge,
    ActionIcon,
    Modal,
    Button
} from "@mantine/core";

import {
    IconPencil,
    IconTrash
} from "@tabler/icons-react";

function FriendCard({ friend, onEdit, onDelete }) {
    const [opened, setOpened] = useState(false);

    const months = [
        "января",
        "февраля",
        "марта",
        "апреля",
        "мая",
        "июня",
        "июля",
        "августа",
        "сентября",
        "октября",
        "ноября",
        "декабря"
    ];

    return (
        <>
            <Card
                padding="md"
                radius="md"
                withBorder
            >
                <Group justify="space-between">
                    <div>
                        <Text fw={600}>
                            {friend.name}
                        </Text>

                        <Text
                            size="sm"
                            c="dimmed"
                            mt={3}
                        >
                            {friend.birthday_day}{" "}
                            {months[friend.birthday_month - 1]}
                        </Text>
                    </div>

                    <Group gap="xs">
                        <Badge>
                            {friend.days === 0
                                ? "Сегодня"
                                : `${friend.days} дн.`}
                        </Badge>

                        <ActionIcon
                            variant="light"
                            color="blue"
                            size="lg"
                            radius="md"
                            onClick={() =>
                                onEdit(friend)
                            }
                            aria-label="Редактировать"
                        >
                            <IconPencil size={18} />
                        </ActionIcon>

                        <ActionIcon
                            variant="light"
                            color="red"
                            size="lg"
                            radius="md"
                            onClick={() =>
                                setOpened(true)
                            }
                            aria-label="Удалить"
                        >
                            <IconTrash size={18} />
                        </ActionIcon>
                    </Group>
                </Group>
            </Card>

            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                centered
                title="Удаление друга"
            >
                <Text>
                    Удалить «{friend.name}»?
                </Text>

                <Text
                    size="sm"
                    c="dimmed"
                    mt="xs"
                >
                    Это действие нельзя отменить.
                </Text>

                <Group
                    justify="flex-end"
                    mt="xl"
                >
                    <Button
                        variant="default"
                        onClick={() =>
                            setOpened(false)
                        }
                    >
                        Отмена
                    </Button>

                    <Button
                        color="red"
                        onClick={() => {
                            onDelete(friend.id);
                            setOpened(false);
                        }}
                    >
                        Удалить
                    </Button>
                </Group>
            </Modal>
        </>
    );
}

export default FriendCard;