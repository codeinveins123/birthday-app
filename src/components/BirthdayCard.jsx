import { Card, Text, Title, Badge } from "@mantine/core";

function BirthdayCard({ friend }) {
    if (!friend) {
        return null;
    }

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
        <Card
            padding="xl"
            radius="lg"
            mb="xl"
            withBorder
        >
            <Text size="sm" c="dimmed">
                Ближайший день рождения
            </Text>

            <Title order={2} mt="xs">
                {friend.name}
            </Title>

            <Text size="lg" mt={4}>
                {friend.birthday_day}{" "}
                {months[friend.birthday_month - 1]}
            </Text>

            <Badge mt="md">
                {friend.days === 0
                    ? "Сегодня 🎉"
                    : `Через ${friend.days} дн.`}
            </Badge>
        </Card>
    );
}

export default BirthdayCard;