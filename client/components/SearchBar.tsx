import { View, TouchableOpacity, TextInput, StyleSheet } from "react-native"
import { useState } from "react"
import { Ionicons } from "@expo/vector-icons"
import { searchBillsByKeywords } from "@/api/billsHandler"
import { Bill } from "./types/BillWidgetTypes"

type SearchBarProps = {
    onSearch?: (results: Bill[], keyword: string) => void;
};

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [keywords, setKeywords] = useState<string>("");

    const handleSearchBills = async () => {
        try {
            const bills = await searchBillsByKeywords(keywords)
            onSearch?.(bills, keywords)
        } catch (err) {
            console.error("bill search error: ", err)
        }
    }

    const handleClearSearch = async () => {
        if (keywords.length > 0) {
            setKeywords("")
        }
    }

    return (
        <View style={styles.searchBarContainer}>
            <TouchableOpacity style={styles.searchBtn} onPress={handleSearchBills}>
                <Ionicons 
                    name="search"
                    size={14} 
                    color="black"
                />
            </TouchableOpacity>
            <TextInput
                style={styles.textInput}
                onChangeText={setKeywords}
                value={keywords}
                placeholder="search bills"
                onSubmitEditing={handleSearchBills}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    searchBarContainer: {
        flex: 1,
        backgroundColor: "white",
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 14,
        width: "90%",
        paddingHorizontal: 6,
        marginBottom: 30,
    },
    textInput: {
        flex: 1,
        padding: 8,
        borderRadius: 12,
        fontFamily: 'InterSemiBold',
        letterSpacing: -0.4,
        fontSize: 14
    },
    searchBtn: {
        paddingHorizontal: 8,
        backgroundColor: '#fff',
        borderRadius: 14,
        marginLeft: "auto"
    }
})

export default SearchBar