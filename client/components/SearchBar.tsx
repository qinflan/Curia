import { View, TouchableOpacity, TextInput, StyleSheet } from "react-native"
import { useState } from "react"
import { Ionicons } from "@expo/vector-icons"
import { searchBillsByKeywords } from "@/api/billsHandler"
import { Bill } from "./types/BillWidgetTypes"

type SearchBarProps = {
    onSearch?: (results: Bill[]) => void;
};

const SearchBar: React.FC<SearchBarProps> = ( { onSearch }) => {
    const [keywords, setKeywords] = useState<string>("");

    const handleSearchBills = async () => {
        try {
            const bills = await searchBillsByKeywords(keywords)
            onSearch?.(bills)
        } catch (err) {
            console.error("bill search error: ", err)
        }
    }

    return (
        <View style={styles.searchBarContainer}>
            <TextInput
                style={styles.textInput}
                onChangeText={setKeywords}
                value={keywords}
                placeholder="search bills"
            />
            <TouchableOpacity style={styles.searchBtn} onPress={handleSearchBills}>
                <Ionicons 
                    name="search"
                    size={14} 
                    color="white"
                />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    searchBarContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
         backgroundColor: "white",
        borderRadius: 50,
        width: "90%",
        paddingHorizontal: 6,
        marginBottom: 20, // temp
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.01,
        shadowRadius: 12,
        elevation: 1,
        borderWidth: 1,
        borderColor: "#ccc"
    },
    textInput: {
        backgroundColor: "white",
        borderRadius: 50,
        fontFamily: 'InterSemiBold',
        letterSpacing: -0.4,
        marginLeft: 8
    },
    searchBtn: {
        backgroundColor: "#000000ff",
        borderRadius: 100,
        padding: 6,
        marginLeft: "auto"
    }
})

export default SearchBar