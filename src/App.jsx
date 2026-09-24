import { useEffect, useState } from "react";

import {
    MantineProvider,
    Container,
    Title,
    Text,
    Button,
    Group,
    Stack
} from "@mantine/core";

import "@mantine/core/styles.css";

import { base } from "./base.js";

import BirthdayCard from "./components/BirthdayCard";
import FriendCard from "./components/FriendCard";
import FriendModal from "./components/FriendModal";
import PasswordModal from "./components/PasswordModal";

function App() {
    const [friends, setFriends] = useState([]);

    const [opened, setOpened] = useState(false);
    const [editingFriend, setEditingFriend] = useState(null);

    const [name, setName] = useState("");
    const [day, setDay] = useState("");
    const [month, setMonth] = useState("");

    const [passwordOpened, setPasswordOpened] = useState(false);
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState(false);

    const [passwordAction, setPasswordAction] = useState(null);
    const [actionPassword, setActionPassword] = useState("");

    const [pendingFriend, setPendingFriend] = useState(null);
    const [pendingDeleteId, setPendingDeleteId] = useState(null);

    useEffect(() => {
        loadFriends();
    }, []);

    async function loadFriends() {
        const { data, error } = await base
            .from("friends")
            .select("*");

        if (error) {
            console.error(error);
            return;
        }

        setFriends(data);
    }

    function getDaysUntilBirthday(month, day) {
        const today = new Date();

        today.setHours(0, 0, 0, 0);

        let birthday = new Date(
            today.getFullYear(),
            month - 1,
            day
        );

        birthday.setHours(0, 0, 0, 0);

        if (birthday < today) {
            birthday = new Date(
                today.getFullYear() + 1,
                month - 1,
                day
            );
        }

        return Math.ceil(
            (birthday - today) / (1000 * 60 * 60 * 24)
        );
    }

    function openAdd() {
        setPasswordAction("add");
        setPassword("");
        setPasswordError(false);
        setPasswordOpened(true);
    }

    function openEdit(friend) {
        setPendingFriend(friend);
        setPasswordAction("edit");
        setPassword("");
        setPasswordError(false);
        setPasswordOpened(true);
    }

    function requestDelete(id) {
        setPendingDeleteId(id);
        setPasswordAction("delete");
        setPassword("");
        setPasswordError(false);
        setPasswordOpened(true);
    }

    async function checkPassword(e) {
        e.preventDefault();

        const { data, error } = await base.rpc(
            "check_password",
            {
                input_password: password
            }
        );

        if (error) {
            console.error(error);
            return;
        }

        if (!data) {
            setPasswordError(true);
            return;
        }

        setPasswordError(false);

        setActionPassword(password);

        setPassword("");
        setPasswordOpened(false);

        if (passwordAction === "add") {
            setEditingFriend(null);
            setName("");
            setDay("");
            setMonth("");
            setOpened(true);
        }

        if (passwordAction === "edit") {
            setEditingFriend(pendingFriend);
            setName(pendingFriend.name);
            setDay(String(pendingFriend.birthday_day));
            setMonth(String(pendingFriend.birthday_month));
            setOpened(true);
        }

        if (passwordAction === "delete") {
            await deleteFriend(
                pendingDeleteId,
                password
            );

            setActionPassword("");
            setPasswordAction(null);
            setPendingDeleteId(null);
        }
    }

    function closeModal() {
        setOpened(false);
        setEditingFriend(null);
        setName("");
        setDay("");
        setMonth("");
        setActionPassword("");
        setPasswordAction(null);
        setPendingFriend(null);
    }

    function closePasswordModal() {
        setPasswordOpened(false);
        setPassword("");
        setPasswordError(false);
        setPasswordAction(null);
        setActionPassword("");
        setPendingFriend(null);
        setPendingDeleteId(null);
    }

    async function saveFriend(e) {
        e.preventDefault();

        if (editingFriend) {
            const { data, error } = await base.rpc(
                "update_friend_with_password",
                {
                    p_id: editingFriend.id,
                    p_name: name,
                    p_birthday_day: Number(day),
                    p_birthday_month: Number(month),
                    p_password: actionPassword
                }
            );

            if (error) {
                console.error(error);
                return;
            }

            setFriends(
                friends.map((friend) =>
                    friend.id === editingFriend.id
                        ? data[0]
                        : friend
                )
            );
        } else {
            const { data, error } = await base.rpc(
                "add_friend_with_password",
                {
                    p_name: name,
                    p_birthday_day: Number(day),
                    p_birthday_month: Number(month),
                    p_password: actionPassword
                }
            );

            if (error) {
                console.error(error);
                return;
            }

            setFriends([...friends, data[0]]);
        }

        closeModal();
    }

    async function deleteFriend(id, passwordValue) {
        const { error } = await base.rpc(
            "delete_friend_with_password",
            {
                p_id: id,
                p_password: passwordValue
            }
        );

        if (error) {
            console.error(error);
            return;
        }

        setFriends(
            friends.filter((friend) => friend.id !== id)
        );
    }

    const friendsWithDays = friends
        .map((friend) => ({
            ...friend,
            days: getDaysUntilBirthday(
                friend.birthday_month,
                friend.birthday_day
            )
        }))
        .sort((a, b) => a.days - b.days);

    const closestFriend = friendsWithDays[0];

    return (
        <MantineProvider defaultColorScheme="dark">
            <Container size="sm" py="xl">

                <Group justify="space-between" mb="xl">
                    <div>
                        <Title order={1}>
                            Мои друзья
                        </Title>

                        <Text c="dimmed">
                            Дни рождения друзей
                        </Text>
                    </div>

                    <Button onClick={openAdd}>
                        + Добавить
                    </Button>
                </Group>

                <BirthdayCard
                    friend={closestFriend}
                />

                <Title order={3} mb="md">
                    Все друзья
                </Title>

                <Stack>
                    {friendsWithDays.map((friend) => (
                        <FriendCard
                            key={friend.id}
                            friend={friend}
                            onEdit={openEdit}
                            onDelete={requestDelete}
                        />
                    ))}
                </Stack>

                {friends.length === 0 && (
                    <Text c="dimmed" ta="center" mt="xl">
                        Пока здесь никого нет
                    </Text>
                )}

                <FriendModal
                    opened={opened}
                    onClose={closeModal}
                    onSubmit={saveFriend}
                    editingFriend={editingFriend}
                    name={name}
                    setName={setName}
                    day={day}
                    setDay={setDay}
                    month={month}
                    setMonth={setMonth}
                />

                <PasswordModal
                    opened={passwordOpened}
                    onClose={closePasswordModal}
                    onSubmit={checkPassword}
                    password={password}
                    setPassword={setPassword}
                    error={passwordError}
                />

            </Container>
        </MantineProvider>
    );
}

export default App;