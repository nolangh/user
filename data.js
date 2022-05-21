const ROLE = {
	ADMIN: "admin",
	BASIC: "basic",
};

module.exports = {
	ROLE: ROLE,
	users: [
		{ id: 1, name: "kyle", role: ROLE.ADMIN },
		{ id: 2, name: "Sally", role: ROLE.ADMIN },
		{ id: 3, name: "Joe", role: ROLE.ADMIN },
	],
	projects: [
		{ id: 1, name: "Kyle's email", userId: 1 },
		{ id: 2, name: "Sally's email", userId: 2 },
		{ id: 3, name: "Joe's email", userId: 3 },
	],
};
